"""
CortexOS 外部大脑 MCP Server（统一版 v2.1 - 协同进化版）
基于 FastMCP，暴露大脑的核心操作 Tool。
新增：秘钥写入工具、Obsidian 协同增强日志。
启动方式：uv run server.py
接入配置：{ "command": "uv", "args": ["run", "/path/to/CortexOS/mcp_server/server.py"] }
"""

import json
import os
import re
import sqlite3
import subprocess
from datetime import UTC, datetime
from pathlib import Path

from fastmcp import FastMCP
try:
    import chromadb
    from chromadb.utils import embedding_functions
except Exception:
    chromadb = None
    embedding_functions = None

# ===== 全局路径常量 =====
BRAIN_ROOT = Path(__file__).resolve().parents[1]
DOCS = BRAIN_ROOT / "docs"
FLEET_JSON = BRAIN_ROOT / "docs" / "public" / "data" / "ai_team_status.json"
RULES_DIR = DOCS / "rules"
ASSISTANT_MEMORY_HOME = Path(
    os.environ.get(
        "CORTEXOS_ASSISTANT_MEMORY_HOME",
        str((BRAIN_ROOT / ".memory").resolve()),
    )
).expanduser()
MEMORY_LOGS = ASSISTANT_MEMORY_HOME / "logs"
ROUTER = DOCS / "router.md"
SECRETS_DIR = Path(
    os.environ.get(
        "CORTEXOS_SECRET_HOME",
        str((Path.home() / "Documents" / "memory" / "secrets").resolve()),
    )
)
KNOWLEDGE_DIR = Path(os.environ.get("CORTEXOS_KNOWLEDGE_HOME", str((BRAIN_ROOT.parent / "memory" / "knowledge").resolve())))
AI_TEAM_DB = ASSISTANT_MEMORY_HOME / "sqlite" / "ai-team.db"

mcp = FastMCP(name="CortexOS Brain")

# ChromaDB 语义检索客户端（不可用时自动降级为全文检索）
CHROMA_CLIENT = None
EMBED_FN = None
if chromadb and embedding_functions:
    try:
        CHROMA_CLIENT = chromadb.PersistentClient(path=str(BRAIN_ROOT / "chroma_db"))
        EMBED_FN = embedding_functions.OllamaEmbeddingFunction(
            url=os.environ.get("CORTEXOS_OLLAMA_EMBED_URL", "http://localhost:11434/api/embeddings"),
            model_name=os.environ.get("CORTEXOS_OLLAMA_EMBED_MODEL", "nomic-embed-text"),
        )
    except Exception:
        CHROMA_CLIENT = None
        EMBED_FN = None


# ─────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────
def _task_id_pattern() -> re.Pattern[str]:
    # 兼容历史任务书、日期任务与数据库自动生成任务号
    return re.compile(r"(?:task[-#]?\d{1,14}(?:-[a-z0-9-]+)?|\d{4}-\d{2}-\d{2}-[a-z0-9-]+)", re.IGNORECASE)


def _priority_rank(priority: str) -> int:
    text = (priority or "").lower()
    if any(token in text for token in ["high", "紧急", "高", "🔴"]):
        return 0
    if any(token in text for token in ["medium", "重要", "中", "🟡"]):
        return 1
    if any(token in text for token in ["low", "低", "🟢"]):
        return 2
    return 3


def _sanitize_cell(value: str) -> str:
    return str(value or "").replace("|", "｜").strip()


def _normalize_agent(value: str) -> str:
    raw = str(value or "").strip()
    if not raw:
        return "Unknown"
    lower = raw.lower()
    if "gemini" in lower:
        return "Gemini"
    if "codex" in lower:
        return "Codex"
    if "claude" in lower:
        return "Claude"
    if "lobster" in lower:
        return "Lobster"
    if "opencode" in lower:
        return "OpenCode"
    return raw


def _normalize_role(value: str) -> str:
    raw = str(value or "").strip()
    if not raw:
        return "未分配"
    lower = raw.lower()
    if re.search(r"(前端|frontend|front-end|fe)", lower, re.IGNORECASE):
        return "前端"
    if re.search(r"(后端|backend|back-end|be)", lower, re.IGNORECASE):
        return "后端"
    return raw


def _infer_role_from_task(task: str) -> str:
    text = str(task or "").lower()
    if not text:
        return "未分配"
    if re.search(r"(前端|frontend|react|vue|页面|样式|css|ui|ux|h5|web)", text, re.IGNORECASE):
        return "前端"
    if re.search(r"(后端|backend|api|服务|接口|数据库|db|sql|redis|中间件|server)", text, re.IGNORECASE):
        return "后端"
    return "未分配"


def _complete_ai_team_db_task(task_id: str, agent: str = "Codex", summary: str = "") -> dict[str, object]:
    normalized_task_id = (task_id or "").strip()
    if not normalized_task_id or not AI_TEAM_DB.exists():
        return {"found": False}

    now_iso = datetime.now(UTC).replace(microsecond=0).isoformat().replace("+00:00", "Z")
    now_local = datetime.now().strftime("%Y-%m-%d %H:%M")

    with sqlite3.connect(AI_TEAM_DB) as conn:
        conn.row_factory = sqlite3.Row
        row = conn.execute(
            """
            SELECT task_id, title, assignee_member_id, completed, status
            FROM tasks
            WHERE lower(task_id) = lower(?)
            LIMIT 1
            """,
            (normalized_task_id,),
        ).fetchone()
        if not row:
            return {"found": False}

        if int(row["completed"] or 0) != 1 and (row["status"] or "").strip() != "已完成":
            conn.execute(
                """
                UPDATE tasks
                SET status = '已完成', completed = 1, updated_at = ?, synced_at = ?
                WHERE lower(task_id) = lower(?)
                """,
                (now_iso, now_iso, normalized_task_id),
            )

        assignee_member_id = (row["assignee_member_id"] or "").strip()
        if assignee_member_id:
            agent_row = conn.execute(
                """
                SELECT member_id, task
                FROM agents
                WHERE lower(member_id) = lower(?)
                LIMIT 1
                """,
                (assignee_member_id,),
            ).fetchone()
            if agent_row and normalized_task_id.lower() in (agent_row["task"] or "").lower():
                conn.execute(
                    """
                    UPDATE agents
                    SET task = '待分配任务', updated_at = ?, heartbeat_at = COALESCE(NULLIF(heartbeat_at, ''), ?)
                    WHERE lower(member_id) = lower(?)
                    """,
                    (now_local, now_local, assignee_member_id),
                )

        conn.execute(
            """
            INSERT INTO operation_logs (action, target_type, target_id, payload_json)
            VALUES (?, ?, ?, ?)
            """,
            (
                "complete-task",
                "tasks",
                row["task_id"],
                json.dumps(
                    {
                        "operator": (agent or "Codex").strip() or "Codex",
                        "reason": "mcp:task_handoff_check",
                        "taskId": row["task_id"],
                        "title": row["title"] or row["task_id"],
                        "summary": (summary or "").strip(),
                    },
                    ensure_ascii=False,
                ),
            ),
        )

    return {"found": True, "task_id": row["task_id"], "already_done": int(row["completed"] or 0) == 1 or (row["status"] or "").strip() == "已完成"}

def _strip_md(text: str) -> str:
    cleaned = re.sub(r"\*\*|`", "", text or "")
    cleaned = re.sub(r"^[-#\s]+", "", cleaned)
    return re.sub(r"\s+", " ", cleaned).strip()


def _now_local() -> str:
    return datetime.now().strftime("%Y-%m-%d %H:%M")


def _build_identity_key(agent_name: str, alias: str, workspace: str) -> str:
    return f"{_strip_md(agent_name or 'Unknown')}::{_strip_md(alias or agent_name or 'Unknown')}::{_strip_md(workspace or '')}"


def _extract_member_index(member_id: str) -> int:
    match = re.search(r"-(\d+) \(", _strip_md(member_id))
    return int(match.group(1)) if match else 0


def _is_legacy_prime_member_id(member_id: str) -> bool:
    text = _strip_md(member_id).lower()
    return "-prime" in text or "0号机" in text


def _choose_stable_member_id(current: str, agent_name: str, alias: str, used_ids: set[str]) -> str:
    current = _strip_md(current)
    if current and not _is_legacy_prime_member_id(current) and current not in used_ids:
        return current

    base_alias = _strip_md(alias or "Agent")
    base_agent = _strip_md(agent_name or "Unknown")
    for index in range(1, 1000):
        candidate = f"{base_alias}-{index} ({base_agent})"
        if candidate not in used_ids:
            return candidate
    return f"{base_alias}-9999 ({base_agent})"


def _status_to_type(status: str) -> str:
    text = str(status or "")
    if "已离线" in text:
        return "offline"
    if "等待分配" in text or "待处理" in text:
        return "queued"
    if "执行中" in text or "队长锁" in text:
        return "active"
    return "unknown"


def _is_idle_task_text(text: str) -> bool:
    return _strip_md(text).replace(" ", "") in {
        "",
        "待分配任务",
        "待分配",
        "待命状态",
        "待命",
        "空闲",
        "无任务",
        "心跳打卡",
    }


def _parse_live_task_record(agent_row: sqlite3.Row) -> dict | None:
    text = _strip_md(agent_row["task"] or "")
    if _is_idle_task_text(text):
        return None

    parts = [part.strip() for part in text.split("｜") if part.strip()]
    has_task_id = len(parts) > 1 and re.match(r"^(task[-#]?\d|\d{4}-\d{2}-\d{2}-)", parts[0], re.IGNORECASE)

    return {
        "taskId": parts[0] if has_task_id else "",
        "title": "｜".join(parts[1:] if has_task_id else parts) or text,
        "status": "执行中",
        "priority": "当前",
        "publishedAt": "",
        "updatedAt": agent_row["heartbeatAt"] or agent_row["updatedAt"] or "",
        "isLive": True,
    }


def _build_recent_tasks(conn: sqlite3.Connection, agent_row: sqlite3.Row, limit: int = 6) -> list[dict]:
    rows = conn.execute(
        """
        SELECT
          task_id AS taskId,
          title,
          status,
          priority,
          published_at AS publishedAt,
          updated_at AS updatedAt,
          completed
        FROM tasks
        WHERE lower(assignee_member_id) = lower(?)
           OR (
                (assignee_member_id IS NULL OR assignee_member_id = '')
            AND lower(assignee_agent) = lower(?)
            AND lower(workspace) = lower(?)
            AND lower(assignee) = lower(?)
           )
        ORDER BY completed ASC, updated_at DESC, id DESC
        LIMIT ?
        """,
        (
            _strip_md(agent_row["memberId"] or ""),
            _strip_md(agent_row["agentName"] or ""),
            _strip_md(agent_row["workspace"] or ""),
            _strip_md(agent_row["alias"] or agent_row["memberId"] or ""),
            limit,
        ),
    ).fetchall()

    recent_tasks = [
        {
            "taskId": row["taskId"],
            "title": row["title"] or row["taskId"],
            "status": "已完成" if int(row["completed"] or 0) == 1 else (row["status"] or "待启动"),
            "priority": row["priority"] or "中",
            "publishedAt": row["publishedAt"] or "",
            "updatedAt": row["updatedAt"] or "",
            "isLive": False,
        }
        for row in rows
    ]

    live_task = _parse_live_task_record(agent_row)
    if not live_task:
        return recent_tasks

    for task in recent_tasks:
        if live_task["taskId"] and task["taskId"] and live_task["taskId"].lower() == task["taskId"].lower():
            task["isLive"] = True
            task["status"] = live_task["status"]
            return recent_tasks
        if task["title"] == live_task["title"]:
            task["isLive"] = True
            task["status"] = live_task["status"]
            return recent_tasks

    return [live_task, *recent_tasks][:limit]


def _build_fleet_state_payload() -> dict:
    if not AI_TEAM_DB.exists():
        return {
            "generatedAt": datetime.now(UTC).isoformat().replace("+00:00", "Z"),
            "total": 0,
            "active": 0,
            "offline": 0,
            "queued": 0,
            "captain": None,
            "agents": [],
            "missions": [],
            "recentCaptainEvents": [],
            "recentOperations": [],
        }

    with sqlite3.connect(AI_TEAM_DB) as conn:
        conn.row_factory = sqlite3.Row
        agent_rows = conn.execute(
            """
            SELECT
              identity_key AS identityKey,
              member_id AS memberId,
              node_id AS nodeId,
              agent_name AS agentName,
              alias,
              role,
              workspace,
              task,
              type,
              is_captain AS isCaptain,
              status,
              heartbeat_at AS heartbeatAt,
              updated_at AS updatedAt
            FROM agents
            ORDER BY is_captain DESC, updated_at DESC, agent_name ASC
            """
        ).fetchall()

        agents = []
        for row in agent_rows:
            agent = {
                "identityKey": row["identityKey"] or "",
                "memberId": row["memberId"] or "",
                "nodeId": row["nodeId"] or row["memberId"] or "",
                "agentName": row["agentName"] or "",
                "alias": row["alias"] or "",
                "role": row["role"] or "",
                "workspace": row["workspace"] or "",
                "task": row["task"] or "待分配任务",
                "type": row["type"] or _status_to_type(row["status"] or ""),
                "isCaptain": int(row["isCaptain"] or 0),
                "status": row["status"] or "",
                "heartbeatAt": row["heartbeatAt"] or "",
                "updatedAt": row["updatedAt"] or "",
            }
            agent["recentTasks"] = _build_recent_tasks(conn, agent)
            agents.append(agent)

        missions = []
        task_rows = conn.execute(
            """
            SELECT
              task_id AS taskId,
              title,
              assignee,
              assignee_member_id AS assigneeMemberId,
              assignee_agent AS assigneeAgent,
              assignee_role AS assigneeRole,
              workspace,
              published_at AS publishedAt,
              status,
              priority,
              priority_rank AS priorityRank,
              completed
            FROM tasks
            ORDER BY completed ASC, priority_rank ASC, updated_at DESC, task_id ASC
            LIMIT 20
            """
        ).fetchall()
        for index, row in enumerate(task_rows, start=1):
            missions.append(
                {
                    "id": f"任务-{index:02d}",
                    "taskId": row["taskId"],
                    "title": row["title"] or row["taskId"],
                    "status": "已完成" if int(row["completed"] or 0) == 1 else (row["status"] or "待启动"),
                    "owner": row["assignee"] or "待分配",
                    "priority": row["priority"] or "中",
                    "assigneeMemberId": row["assigneeMemberId"] or "",
                    "assigneeAgent": row["assigneeAgent"] or "",
                    "assigneeRole": row["assigneeRole"] or "",
                    "workspace": row["workspace"] or "",
                    "publishedAt": row["publishedAt"] or "",
                }
            )

        recent_captain_events = [
            {
                "id": row["id"],
                "fromMemberId": row["fromMemberId"],
                "toMemberId": row["toMemberId"],
                "reason": row["reason"],
                "operator": row["operator"],
                "createdAt": row["createdAt"],
            }
            for row in conn.execute(
                """
                SELECT
                  id,
                  from_member_id AS fromMemberId,
                  to_member_id AS toMemberId,
                  reason,
                  operator,
                  created_at AS createdAt
                FROM captain_events
                ORDER BY id DESC
                LIMIT 10
                """
            ).fetchall()
        ]

        recent_operations = [
            {
                "id": row["id"],
                "action": row["action"],
                "targetType": row["targetType"],
                "targetId": row["targetId"],
                "createdAt": row["createdAt"],
            }
            for row in conn.execute(
                """
                SELECT
                  id,
                  action,
                  target_type AS targetType,
                  target_id AS targetId,
                  created_at AS createdAt
                FROM operation_logs
                ORDER BY id DESC
                LIMIT 20
                """
            ).fetchall()
        ]

    captain = next((agent["memberId"] for agent in agents if agent["isCaptain"]), None)
    return {
        "generatedAt": datetime.now(UTC).isoformat().replace("+00:00", "Z"),
        "total": len(agents),
        "active": sum(1 for agent in agents if agent["type"] == "active"),
        "offline": sum(1 for agent in agents if agent["type"] == "offline"),
        "queued": sum(1 for agent in agents if agent["type"] == "queued"),
        "captain": captain,
        "agents": agents,
        "missions": missions,
        "recentCaptainEvents": recent_captain_events,
        "recentOperations": recent_operations,
    }


def _sync_live_task_records(conn: sqlite3.Connection, agents: list[dict]) -> None:
    for agent in agents:
        if agent["type"] == "offline":
            continue
        live_task = _parse_live_task_record(agent)
        if not live_task or not _strip_md(live_task["title"]):
            continue

        task_id = _strip_md(live_task["taskId"])
        title = _strip_md(live_task["title"])
        existing = None
        if task_id:
            existing = conn.execute(
                """
                SELECT task_id AS taskId, title, published_at AS publishedAt, priority
                FROM tasks
                WHERE lower(task_id) = lower(?)
                LIMIT 1
                """,
                (task_id,),
            ).fetchone()
        if not existing:
            existing = conn.execute(
                """
                SELECT task_id AS taskId, title, published_at AS publishedAt, priority
                FROM tasks
                WHERE completed = 0
                  AND lower(title) = lower(?)
                  AND lower(workspace) = lower(?)
                  AND (
                    lower(assignee_member_id) = lower(?)
                    OR (
                      (assignee_member_id IS NULL OR assignee_member_id = '')
                      AND lower(assignee_agent) = lower(?)
                      AND lower(assignee) = lower(?)
                    )
                  )
                ORDER BY updated_at DESC, id DESC
                LIMIT 1
                """,
                (
                    title,
                    _strip_md(agent["workspace"]),
                    _strip_md(agent["memberId"]),
                    _strip_md(agent["agentName"]),
                    _strip_md(agent["alias"] or agent["memberId"]),
                ),
            ).fetchone()

        resolved_task_id = task_id or (existing["taskId"] if existing else f"task-{datetime.now().strftime('%Y%m%d%H%M')}-{os.urandom(2).hex()}")
        resolved_title = _strip_md(existing["title"] if existing and existing["title"] else title)
        published_at = _strip_md(existing["publishedAt"] if existing else "") or _now_local()
        priority = _strip_md(existing["priority"] if existing else "") or "中"
        synced_at = datetime.now(UTC).replace(microsecond=0).isoformat().replace("+00:00", "Z")

        conn.execute(
            """
            INSERT INTO tasks (
              task_id, title, assignee, assignee_member_id, assignee_agent, assignee_role,
              workspace, published_at, status, priority, priority_rank, completed, updated_at, synced_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, '执行中', ?, ?, 0, ?, ?)
            ON CONFLICT(task_id) DO UPDATE SET
              title = excluded.title,
              assignee = excluded.assignee,
              assignee_member_id = excluded.assignee_member_id,
              assignee_agent = excluded.assignee_agent,
              assignee_role = excluded.assignee_role,
              workspace = excluded.workspace,
              published_at = CASE
                WHEN tasks.published_at IS NULL OR tasks.published_at = '' THEN excluded.published_at
                ELSE tasks.published_at
              END,
              status = '执行中',
              priority = excluded.priority,
              priority_rank = excluded.priority_rank,
              completed = 0,
              updated_at = excluded.updated_at,
              synced_at = excluded.synced_at
            """,
            (
                resolved_task_id,
                resolved_title,
                _strip_md(agent["alias"] or agent["memberId"]),
                _strip_md(agent["memberId"]),
                _strip_md(agent["agentName"]),
                _strip_md(agent["role"]),
                _strip_md(agent["workspace"]),
                published_at,
                priority,
                _priority_rank(priority),
                synced_at,
                synced_at,
            ),
        )

        agent["task"] = f"{resolved_task_id}｜{resolved_title}"


def _persist_agents(agents: list[dict], operator: str, action: str, reason: str, payload: dict | None = None) -> dict:
    if not AI_TEAM_DB.exists():
        raise FileNotFoundError(f"AI Team DB 不存在: {AI_TEAM_DB}")

    normalized_agents: list[dict] = []
    used_ids: set[str] = set()
    for raw in agents:
        agent = dict(raw)
        agent["agentName"] = _normalize_agent(agent.get("agentName"))
        agent["alias"] = _strip_md(agent.get("alias") or agent["agentName"])
        agent["role"] = _normalize_role(agent.get("role") or _infer_role_from_task(agent.get("task", "")))
        agent["workspace"] = _strip_md(agent.get("workspace"))
        agent["task"] = _strip_md(agent.get("task") or "待分配任务")
        agent["type"] = _strip_md(agent.get("type") or "active")
        agent["status"] = _strip_md(agent.get("status") or "[ 执行中 ] 活跃")
        agent["heartbeatAt"] = _strip_md(agent.get("heartbeatAt") or _now_local())
        agent["updatedAt"] = _strip_md(agent.get("updatedAt") or agent["heartbeatAt"])
        agent["isCaptain"] = 1 if agent.get("isCaptain") else 0
        agent["memberId"] = _choose_stable_member_id(
            agent.get("memberId", ""),
            agent["agentName"],
            agent["alias"],
            used_ids,
        )
        used_ids.add(agent["memberId"])
        agent["nodeId"] = agent["memberId"]
        agent["identityKey"] = _build_identity_key(agent["agentName"], agent["alias"], agent["workspace"])
        normalized_agents.append(agent)

    with sqlite3.connect(AI_TEAM_DB) as conn:
        conn.row_factory = sqlite3.Row
        previous_captain = conn.execute(
            "SELECT member_id FROM agents WHERE is_captain = 1 LIMIT 1"
        ).fetchone()

        _sync_live_task_records(conn, normalized_agents)

        seen_identity_keys = []
        for agent in normalized_agents:
            seen_identity_keys.append(agent["identityKey"])
            conn.execute(
                """
                INSERT INTO agents (
                  member_id, identity_key, node_id, agent_name, alias, role, workspace, task,
                  type, is_captain, status, heartbeat_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(identity_key) DO UPDATE SET
                  node_id = excluded.node_id,
                  member_id = excluded.member_id,
                  agent_name = excluded.agent_name,
                  alias = excluded.alias,
                  role = excluded.role,
                  workspace = excluded.workspace,
                  task = excluded.task,
                  type = excluded.type,
                  is_captain = excluded.is_captain,
                  status = excluded.status,
                  heartbeat_at = excluded.heartbeat_at,
                  updated_at = excluded.updated_at
                """,
                (
                    agent["memberId"],
                    agent["identityKey"],
                    agent["nodeId"],
                    agent["agentName"],
                    agent["alias"],
                    agent["role"],
                    agent["workspace"],
                    agent["task"],
                    agent["type"],
                    agent["isCaptain"],
                    agent["status"],
                    agent["heartbeatAt"],
                    agent["updatedAt"],
                ),
            )

        if seen_identity_keys:
            placeholders = ", ".join("?" for _ in seen_identity_keys)
            conn.execute(f"DELETE FROM agents WHERE identity_key NOT IN ({placeholders})", seen_identity_keys)
        else:
            conn.execute("DELETE FROM agents")

        next_captain = conn.execute(
            "SELECT member_id FROM agents WHERE is_captain = 1 LIMIT 1"
        ).fetchone()
        if (previous_captain["member_id"] if previous_captain else None) != (next_captain["member_id"] if next_captain else None) and next_captain:
            conn.execute(
                """
                INSERT INTO captain_events (from_member_id, to_member_id, reason, operator)
                VALUES (?, ?, ?, ?)
                """,
                (
                    previous_captain["member_id"] if previous_captain else None,
                    next_captain["member_id"],
                    reason,
                    operator,
                ),
            )

        conn.execute(
            """
            INSERT INTO operation_logs (action, target_type, target_id, payload_json)
            VALUES (?, ?, ?, ?)
            """,
            (
                action,
                "fleet",
                next_captain["member_id"] if next_captain else None,
                json.dumps(
                    {
                        "operator": operator,
                        "reason": reason,
                        "agents": [
                            {
                                "memberId": agent["memberId"],
                                "agentName": agent["agentName"],
                                "workspace": agent["workspace"],
                                "isCaptain": bool(agent["isCaptain"]),
                            }
                            for agent in normalized_agents
                        ],
                        "payload": payload or {},
                    },
                    ensure_ascii=False,
                ),
            ),
        )

    captain_member_id = next((agent["memberId"] for agent in normalized_agents if agent["isCaptain"]), None)
    return {
        "ok": True,
        "captain": captain_member_id,
        "agents": normalized_agents,
    }


def _claim_ai_team_member(workspace: str, task: str, agent: str, alias: str, role: str, status: str = "[ 执行中 ] 活跃") -> dict:
    normalized_workspace = str(Path(workspace).expanduser().resolve())
    normalized_task = _sanitize_cell(task or "待分配任务")
    normalized_agent = _normalize_agent(agent)
    normalized_alias = _sanitize_cell(alias or normalized_agent)
    normalized_role = _normalize_role(role or _infer_role_from_task(normalized_task))
    heartbeat_at = _now_local()

    state = _build_fleet_state_payload()
    agents = [dict(item) for item in state.get("agents", [])]

    target = next(
        (
            item for item in agents
            if _strip_md(item.get("workspace")) == normalized_workspace
            and _normalize_agent(item.get("agentName")) == normalized_agent
            and _strip_md(item.get("alias")) == normalized_alias
        ),
        None,
    )

    same_workspace_rows = [item for item in agents if _strip_md(item.get("workspace")) == normalized_workspace]
    parallel_rows = [item for item in same_workspace_rows if not target or item.get("memberId") != target.get("memberId")]
    warnings = []
    if parallel_rows:
        warnings.append(
            "同一路径已有其他模型在线: "
            + "、".join(f"{item.get('agentName')}（{item.get('memberId')}）" for item in parallel_rows)
            + "。已允许并行登记，请注意文件冲突。"
        )

    if not target:
        target = {
            "memberId": f"{normalized_alias}-1 ({normalized_agent})",
            "nodeId": "",
            "identityKey": "",
            "agentName": normalized_agent,
            "alias": normalized_alias,
            "role": normalized_role,
            "workspace": normalized_workspace,
            "task": normalized_task,
            "type": "active",
            "isCaptain": 0,
            "status": status,
            "heartbeatAt": heartbeat_at,
            "updatedAt": heartbeat_at,
        }
        agents.append(target)

    target.update(
        {
            "agentName": normalized_agent,
            "alias": normalized_alias,
            "role": normalized_role,
            "workspace": normalized_workspace,
            "task": normalized_task,
            "heartbeatAt": heartbeat_at,
            "updatedAt": heartbeat_at,
        }
    )

    has_captain = any(int(item.get("isCaptain") or 0) == 1 for item in agents)
    if not has_captain or int(target.get("isCaptain") or 0) == 1:
        for item in agents:
            if item is target:
                continue
            item["isCaptain"] = 0
            if item.get("type") != "offline":
                item["type"] = "active"
                item["status"] = "[ 执行中 ] 活跃"
        target["isCaptain"] = 1
        target["type"] = "active"
        target["status"] = "[ 队长锁 ] 活跃"
    else:
        target["isCaptain"] = 0
        target["type"] = _status_to_type(status)
        target["status"] = status

    result = _persist_agents(
        agents,
        operator=normalized_agent,
        action="claim",
        reason="fleet:claim",
        payload={"workspace": normalized_workspace, "task": normalized_task, "role": normalized_role},
    )
    target_after = next((item for item in result["agents"] if item["identityKey"] == _build_identity_key(normalized_agent, normalized_alias, normalized_workspace)), None)
    node_id = target_after["memberId"] if target_after else target["memberId"]
    return {
        **result,
        "machineNumber": 0 if target_after and int(target_after["isCaptain"]) == 1 else _extract_member_index(node_id),
        "nodeId": node_id,
        "warnings": warnings,
    }


def _make_ai_team_captain(member_id: str, operator: str = "system", reason: str = "fleet:handover") -> dict:
    normalized_member_id = _strip_md(member_id)
    state = _build_fleet_state_payload()
    agents = [dict(item) for item in state.get("agents", [])]
    target = next((item for item in agents if _strip_md(item.get("memberId")) == normalized_member_id), None)
    if not target:
        raise ValueError(f"未找到目标节点: {member_id}")

    previous_captain = next((item for item in agents if int(item.get("isCaptain") or 0) == 1), None)
    for agent in agents:
        if agent is target:
            continue
        if int(agent.get("isCaptain") or 0) == 1:
            agent["isCaptain"] = 0
            if agent.get("type") != "offline":
                agent["type"] = "active"
                agent["status"] = "[ 执行中 ] 活跃"
            agent["updatedAt"] = _now_local()

    target["isCaptain"] = 1
    target["type"] = "active"
    target["status"] = "[ 队长锁 ] 活跃"
    target["updatedAt"] = _now_local()

    result = _persist_agents(
        agents,
        operator=operator,
        action="make-captain",
        reason=reason,
        payload={
            "from": previous_captain.get("memberId") if previous_captain else None,
            "to": normalized_member_id,
        },
    )
    new_target = next((item for item in result["agents"] if _strip_md(item.get("identityKey")) == _strip_md(target.get("identityKey"))), target)
    return {
        **result,
        "from": previous_captain.get("memberId") if previous_captain else None,
        "to": new_target.get("memberId"),
    }


def _sync_project_registry(workspace: str, agent: str, role: str, task: str, node_id: str) -> dict | None:
    cmd = [
        "node",
        "scripts/actions/project-registry.mjs",
        "--workspace",
        workspace,
        "--agent",
        agent,
        "--role",
        role,
        "--task",
        task,
        "--node-id",
        node_id,
    ]
    result = subprocess.run(cmd, cwd=str(BRAIN_ROOT), capture_output=True, text=True, timeout=30)
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip() or result.stdout.strip() or "project-registry 同步失败")
    return json.loads(result.stdout.strip() or "{}")


def _sync_fleet_dashboard() -> None:
    cmd = ["node", "scripts/actions/sync-fleet-dashboard.mjs"]
    result = subprocess.run(cmd, cwd=str(BRAIN_ROOT), capture_output=True, text=True, timeout=30)
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip() or result.stdout.strip() or "fleet dashboard 同步失败")


# ─────────────────────────────────────────────
# Tool 1: 读取路由协议（大脑宪法）
# ─────────────────────────────────────────────
@mcp.tool()
def read_router() -> str:
    """读取 router.md——大脑的最高协议和动态路由规则。
    任何 Agent 在开始工作前都应先调用此工具，以获得完整的上下文和行为规范。
    """
    if not ROUTER.exists():
        return "错误：router.md 不存在，请检查 CortexOS 目录。"
    return ROUTER.read_text(encoding="utf-8")


# ─────────────────────────────────────────────
# Tool 2: 读取当前舰队状态
# ─────────────────────────────────────────────
@mcp.tool()
def get_fleet_status() -> str:
    """获取当前所有 AI Agent 的实时状态（JSON 格式）。
    返回进行中的任务、队长节点、工作路径信息，用于感知当前是否存在并行冲突。
    """
    try:
        payload = _build_fleet_state_payload()
        return json.dumps({"ok": True, **payload}, ensure_ascii=False, indent=2)
    except Exception as e:
        return json.dumps({"ok": False, "error": f"fleet 状态读取异常: {e}"}, ensure_ascii=False)


# ─────────────────────────────────────────────
# Tool 3: 登记/更新 Agent 任务（打卡挂牌）
# ─────────────────────────────────────────────
@mcp.tool()
def fleet_claim(
    workspace: str,
    task: str,
    agent: str = "Gemini",
    alias: str = "Candy",
    role: str = "未分配",
) -> str:
    """在 AI 舰队中登记当前 Agent 的工作节点与任务描述（打卡挂牌）。
    必须在开始任何实质性工作之前调用，防止多 Agent 抢占同一工作路径造成冲突。

    参数:
        workspace: 当前工作目录的绝对路径
        task: 本次任务的简短描述（1-2 句话）
        agent: 底层模型名称（Gemini / Claude / Codex）
        alias: 人格名称（Candy / 等）
        role: 节点角色（前端 / 后端）
    """
    try:
        normalized_workspace = str(Path(workspace).expanduser().resolve())
        normalized_task = _sanitize_cell(task or "待分配任务")
        normalized_agent = _normalize_agent(agent)
        normalized_alias = _sanitize_cell(alias or normalized_agent)
        normalized_role = _normalize_role(role or _infer_role_from_task(normalized_task))

        result = _claim_ai_team_member(
            workspace=normalized_workspace,
            task=normalized_task,
            agent=normalized_agent,
            alias=normalized_alias,
            role=normalized_role,
        )

        project_registry = None
        warnings = list(result.get("warnings") or [])
        try:
            project_registry = _sync_project_registry(
                workspace=normalized_workspace,
                agent=normalized_agent,
                role=normalized_role,
                task=normalized_task,
                node_id=result["nodeId"],
            )
        except Exception as error:
            warnings.append(f"项目索引同步失败: {_sanitize_cell(error)}")

        try:
            _sync_fleet_dashboard()
        except Exception as error:
            warnings.append(f"看板数据同步失败: {_sanitize_cell(error)}")

        active_task_id = ""
        for item in result.get("agents") or []:
            if item.get("memberId") == result["nodeId"]:
                active_task_id = _strip_md(str(item.get("task", "")).split("｜")[0])
                break

        payload = {
            "ok": True,
            "machineNumber": result["machineNumber"],
            "nodeId": result["nodeId"],
            "agent": normalized_agent,
            "role": normalized_role,
            "workspace": normalized_workspace,
            "task": normalized_task,
            "activeTaskId": active_task_id,
            "warnings": warnings,
            "projectRegistry": None,
            "dryRun": False,
        }
        if project_registry:
            project = project_registry.get("project") or {}
            files = project_registry.get("files") or {}
            payload["projectRegistry"] = {
                "name": project.get("name"),
                "rootPath": project.get("rootPath"),
                "lastWorkspace": project.get("lastWorkspace"),
                "commandCenterFile": files.get("commandCenterFile"),
            }
        return f"✅ 挂牌成功！\n{json.dumps(payload, ensure_ascii=False, indent=2)}"
    except Exception as e:
        return f"挂牌失败：{e}"


# ─────────────────────────────────────────────
# Tool 4: 队长移交
# ─────────────────────────────────────────────
@mcp.tool()
def fleet_handover(to_node: str) -> str:
    """将队长身份移交给指定的 Agent 节点。

    参数:
        to_node: 目标节点名称（例如 "Codex-3 (Codex)"）
    """
    try:
        result = _make_ai_team_captain(to_node, operator="system", reason="fleet:handover")
        warnings = []
        try:
            _sync_fleet_dashboard()
        except Exception as error:
            warnings.append(f"看板数据同步失败: {_sanitize_cell(error)}")
        payload = {
            "ok": True,
            "from": result["from"],
            "to": result["to"],
            "time": datetime.now(UTC).isoformat().replace("+00:00", "Z"),
            "warnings": warnings,
            "dryRun": False,
        }
        return f"✅ 队长移交完成！\n{json.dumps(payload, ensure_ascii=False, indent=2)}"
    except Exception as e:
        return f"移交失败：{e}"


# ─────────────────────────────────────────────
# Tool 5: 按需加载规则文件（防上下文污染）
# ─────────────────────────────────────────────
@mcp.tool()
def load_rule(rule_name: str) -> str:
    """按名称加载 docs/rules/ 目录下的特定规则文件（懒加载，防止上下文污染）。

    参数:
        rule_name: 规则文件名（不含 .md，例如 "webkubor_vibe_manifesto"）
    """
    target = RULES_DIR / f"{rule_name}.md"
    if not target.exists():
        available = [f.stem for f in RULES_DIR.glob("*.md")]
        return f"规则 '{rule_name}' 不存在。\n可用规则：{', '.join(available)}"
    return target.read_text(encoding="utf-8")


# ─────────────────────────────────────────────
# Tool 6: 列出所有可用规则
# ─────────────────────────────────────────────
@mcp.tool()
def list_rules() -> str:
    """列出 docs/rules/ 目录下所有可用的规则文件名称。"""
    if not RULES_DIR.exists():
        return "rules 目录不存在。"
    rules = [f.stem for f in sorted(RULES_DIR.glob("*.md"))]
    return json.dumps({"available_rules": rules, "count": len(rules)}, ensure_ascii=False, indent=2)


# ─────────────────────────────────────────────
# Tool 7: 写入任务日志（Obsidian 协同版）
# ─────────────────────────────────────────────
@mcp.tool()
def log_task(content: str, agent: str = "Gemini") -> str:
    """将操作记录写入今日日志。
    增强：自动识别内容中的 task-XXX 并生成 Obsidian 双链 [[task-XXX]]。

    参数:
        content: 要记录的内容（Markdown 格式，1-5 句话）
        agent: 操作执行者（模型名称）
    """
    today = datetime.now().strftime("%Y-%m-%d")
    log_file = MEMORY_LOGS / f"{today}.md"
    MEMORY_LOGS.mkdir(parents=True, exist_ok=True)
    
    # 尝试匹配 Task ID 并注入双链，方便在 Obsidian 中反向链接
    task_match = _task_id_pattern().search(content)
    task_link = f" [[{task_match.group(0)}]]" if task_match else ""
    
    timestamp = datetime.now().strftime("%H:%M:%S")
    entry = f"\n## [{timestamp}] by {agent}{task_link}\n{content}\n"
    
    if not log_file.exists():
        log_file.write_text(f"# 操作日志 {today}\ntags: #journal/agent\n", encoding="utf-8")
    with log_file.open("a", encoding="utf-8") as f:
        f.write(entry)
    return f"✅ 日志已写入 {log_file.name} (已增强 Obsidian 协同)"


# ─────────────────────────────────────────────
# Tool 8: 同步舰队状态（触发前端刷新）
# ─────────────────────────────────────────────
@mcp.tool()
def fleet_sync() -> str:
    """触发 pnpm run fleet:sync-dashboard 同步舰队状态，刷新 VitePress 看板数据。"""
    try:
        result = subprocess.run(
            ["pnpm", "run", "fleet:sync-dashboard"],
            cwd=str(BRAIN_ROOT),
            capture_output=True,
            text=True,
            timeout=30,
        )
        if result.returncode != 0:
            return f"同步失败（exit {result.returncode}）：\n{result.stderr.strip()}"
        return f"✅ 同步完成！\n{result.stdout.strip()}"
    except Exception as e:
        return f"执行异常：{e}"


# ─────────────────────────────────────────────
# Tool 9: 列出密钥文件
# ─────────────────────────────────────────────
@mcp.tool()
def list_secrets() -> list[str]:
    """列出外置秘钥库目录下所有可用的密钥文件名称。"""
    if not SECRETS_DIR.exists():
        return []
    return [f.name for f in SECRETS_DIR.iterdir() if f.is_file() and not f.name.startswith(".")]


# ─────────────────────────────────────────────
# Tool 10: 读取密钥文件
# ─────────────────────────────────────────────
@mcp.tool()
def read_secret(name: str) -> str:
    """读取外置秘钥库目录中的指定密钥文件内容。

    参数:
        name: 密钥文件名（例如 'github.md'、'lark.env'）
    """
    secret_path = (SECRETS_DIR / name).resolve()
    if not str(secret_path).startswith(str(SECRETS_DIR.resolve())):
        return "错误：非法路径，禁止访问 secrets 目录之外的文件。"
    if not secret_path.exists():
        available = list_secrets()
        return f"错误：密钥文件 '{name}' 不存在。可用文件：{available}"
    try:
        return secret_path.read_text(encoding="utf-8")
    except Exception as e:
        return f"读取失败：{e}"


# ─────────────────────────────────────────────
# Tool 11: 写入/更新密钥文件 (NEW)
# ─────────────────────────────────────────────
@mcp.tool()
def write_secret(name: str, content: str) -> str:
    """安全地写入或更新秘钥文件。
    该工具会自动确保路径安全，并支持配置信息的持久化。

    参数:
        name: 秘钥文件名（建议以 .md 或 .env 结尾）
        content: 秘钥内容（推荐格式：KEY=VALUE）
    """
    # 强制安全检查
    if "/" in name or ".." in name:
        return "错误：文件名包含非法字符，仅允许在 secrets 根目录写入。"
    
    secret_path = (SECRETS_DIR / name).resolve()
    try:
        SECRETS_DIR.mkdir(parents=True, exist_ok=True)
        secret_path.write_text(content, encoding="utf-8")
        return f"✅ 秘钥 '{name}' 已成功保存至外置目录。"
    except Exception as e:
        return f"写入失败：{str(e)}"


# ─────────────────────────────────────────────
# Tool 12: 发送飞书通知
# ─────────────────────────────────────────────
@mcp.tool()
def send_lark_notification(title: str, body: str) -> str:
    """通过飞书 Webhook 发送通知（仅工作时间 10:00-20:00 有效）。

    参数:
        title: 通知标题
        body: 通知正文（最多 1000 字）
    """
    try:
        script_path = BRAIN_ROOT / "scripts" / "services" / "lark-cli.mjs"
        cmd = [
            "node",
            str(script_path),
            "--title",
            f"🧠 CortexOS: {title}",
            "--body",
            body[:1000],
        ]
        result = subprocess.run(
            cmd,
            cwd=str(BRAIN_ROOT),
            capture_output=True,
            text=True,
            timeout=20,
        )

        parsed = {}
        stdout = (result.stdout or "").strip()
        if stdout:
            try:
                parsed = json.loads(stdout.splitlines()[-1])
            except json.JSONDecodeError:
                parsed = {"ok": False, "status": "error", "reason": stdout}

        if result.returncode == 0 and parsed.get("ok"):
            return "✅ 飞书通知发送成功。"

        reason = parsed.get("reason") or (result.stderr or "未知错误").strip()
        if parsed.get("status") == "skipped":
            return f"通知已跳过：{reason}"
        return f"发送失败：{reason}"
    except Exception as e:
        return f"执行异常：{e}"


# ─────────────────────────────────────────────
# Tool 13: 知识库关键词检索
# ─────────────────────────────────────────────
def _fulltext_search(query: str) -> list[dict]:
    """全文检索兜底逻辑。"""
    results = []
    if not KNOWLEDGE_DIR.exists():
        return results
    for file_path in KNOWLEDGE_DIR.rglob("*"):
        if file_path.is_file() and not file_path.name.startswith("."):
            try:
                if query.lower() in file_path.read_text(encoding="utf-8").lower():
                    relative = str(file_path.relative_to(KNOWLEDGE_DIR))
                    results.append({"file": relative, "match": True, "mode": "fulltext"})
            except Exception:
                continue
    return results


def _candidate_collections() -> list[str]:
    """语义检索候选集合：优先 brain_knowledge，再补充已有集合。"""
    names = ["brain_knowledge"]
    if CHROMA_CLIENT is None:
        return names
    try:
        existing = [item.name for item in CHROMA_CLIENT.list_collections()]
        for preferred in ["cortexos_docs", "ai_common_docs"]:
            if preferred in existing and preferred not in names:
                names.append(preferred)
        for name in existing:
            if name not in names:
                names.append(name)
    except Exception:
        pass
    return names


@mcp.tool()
def search_knowledge(query: str, top_k: int = 5) -> list[dict]:
    """在知识库中进行语义相似度搜索（ChromaDB + nomic-embed-text）。

    参数:
        query: 自然语言查询
        top_k: 返回最相似结果数量（默认 5）
    """
    query = (query or "").strip()
    if not query:
        return []

    if CHROMA_CLIENT is None or EMBED_FN is None:
        return _fulltext_search(query) + [{"mode": "fallback", "error": "semantic_unavailable"}]

    try:
        top_k = max(1, int(top_k))
        output = []
        for name in _candidate_collections():
            try:
                if name == "brain_knowledge":
                    collection = CHROMA_CLIENT.get_or_create_collection(
                        name=name,
                        embedding_function=EMBED_FN,
                    )
                else:
                    collection = CHROMA_CLIENT.get_collection(
                        name=name,
                        embedding_function=EMBED_FN,
                    )
                count = collection.count()
                if count <= 0:
                    continue

                payload = collection.query(
                    query_texts=[query],
                    n_results=min(top_k, count),
                )
                ids = payload.get("ids", [[]])[0]
                documents = payload.get("documents", [[]])[0]
                distances = payload.get("distances", [[]])[0]
                metadatas = payload.get("metadatas", [[]])[0] if payload.get("metadatas") else []

                for i, doc_id in enumerate(ids):
                    output.append(
                        {
                            "id": doc_id,
                            "document": (documents[i] if i < len(documents) else "")[:300],
                            "distance": round(float(distances[i]), 4) if i < len(distances) else None,
                            "metadata": metadatas[i] if i < len(metadatas) else {},
                            "collection": name,
                            "mode": "semantic",
                        }
                    )
            except Exception:
                continue

        if output:
            output.sort(key=lambda item: item["distance"] if item["distance"] is not None else 999999)
            return output[:top_k]
        return _fulltext_search(query)
    except Exception as e:
        return _fulltext_search(query) + [{"mode": "fallback", "error": str(e)}]


# ─────────────────────────────────────────────
# Tool 14: 轻量上下文摘要（冷启动首选，省 Token）
# ─────────────────────────────────────────────
@mcp.tool()
def get_context_brief() -> str:
    """返回大脑当前状态的 200 字以内极简摘要，供 Agent 冷启动快速定向。
    推荐先调用本工具，再按需调用 read_router()。
    """
    captain = ""
    tasks_preview = "无"
    try:
        state_raw = get_fleet_status()
        state = json.loads(state_raw)
        captain = str(state.get("captain") or "").strip()
    except Exception:
        captain = ""

    try:
        queue = _collect_task_queue()
        pending = [item["task_id"] for item in queue if not item["completed"]]
        if pending:
            tasks_preview = "、".join(pending[:3])
            if len(pending) > 3:
                tasks_preview += f" 等{len(pending)}项"
    except Exception:
        tasks_preview = "未知"

    parts = []
    if captain:
        parts.append(f"队长:{captain}")
    parts.append(f"待办:{tasks_preview}")

    if not captain and tasks_preview in {"无", "未知"}:
        return "状态摘要不可用，请调用 read_router() 获取完整上下文。"

    summary = " | ".join(parts)
    if len(summary) > 200:
        return f"{summary[:197].rstrip()}..."
    return summary


def _extract_active_claimed_task_ids() -> set[str]:
    task_ids: set[str] = set()
    try:
        state = json.loads(get_fleet_status())
        agents = state.get("members") or state.get("agents") or []
        for agent in agents:
            for matched in _task_id_pattern().findall(str(agent.get("task", ""))):
                task_ids.add(matched.lower())
    except Exception:
        return set()
    return task_ids

def _collect_task_queue() -> list[dict]:
    if not AI_TEAM_DB.exists():
        return []
    try:
        with sqlite3.connect(AI_TEAM_DB) as conn:
            conn.row_factory = sqlite3.Row
            rows = conn.execute(
                """
                SELECT
                  task_id,
                  title,
                  assignee,
                  assignee_member_id,
                  assignee_agent,
                  completed,
                  status,
                  priority,
                  priority_rank
                FROM tasks
                ORDER BY completed ASC, priority_rank ASC, updated_at DESC, task_id ASC
                """
            ).fetchall()
        return [
            {
                "task_id": str(row["task_id"]).lower(),
                "title": row["title"] or "",
                "assignee": row["assignee"] or "",
                "assignee_member_id": row["assignee_member_id"] or "",
                "assignee_agent": row["assignee_agent"] or "",
                "completed": bool(row["completed"]),
                "status": row["status"] or ("已完成" if row["completed"] else "待启动"),
                "priority": row["priority"] or "未标注",
                "priority_rank": int(row["priority_rank"] or 3),
            }
            for row in rows
        ]
    except Exception:
        return []


def _is_structurally_claimed(task: dict) -> bool:
    assignee_member_id = str(task.get("assignee_member_id") or "").strip()
    assignee_agent = str(task.get("assignee_agent") or "").strip()
    assignee = str(task.get("assignee") or "").strip()
    if assignee_member_id or assignee_agent:
        return True
    return assignee not in {"", "待分配", "待分配任务", "未指定执行人"}


@mcp.tool()
def task_handoff_check(task_id: str = "", agent: str = "Codex", summary: str = "") -> str:
    """任务收工检查：可选标记任务已完成，并返回仍未认领的待办任务列表。

    推荐在每次任务交付后调用：
    1) 传入 task_id 标记完成
    2) 自动检查未认领任务，便于下一位 Agent 接单
    """
    messages: list[str] = []
    normalized_agent = (agent or "Codex").strip() or "Codex"

    if task_id.strip():
        db_result = _complete_ai_team_db_task(task_id, normalized_agent, summary)
        if db_result.get("found"):
            if db_result.get("already_done"):
                messages.append(f"数据库任务已是完成状态: {db_result['task_id']}")
            else:
                messages.append(f"数据库任务已标记完成: {db_result['task_id']}")
        else:
            messages.append(f"未找到数据库任务: {task_id}")

    queue = _collect_task_queue()
    claimed_ids = _extract_active_claimed_task_ids()
    pending = [item for item in queue if not item["completed"]]
    unclaimed = [
        item for item in pending
        if not _is_structurally_claimed(item) and item["task_id"] not in claimed_ids
    ]
    high_pending = [item for item in pending if item["priority_rank"] == 0]

    messages.append(
        f"任务池: 总计{len(queue)} | 待完成{len(pending)} | 高优待完成{len(high_pending)} | 未认领{len(unclaimed)}"
    )
    if unclaimed:
        preview = "；".join(
            f"{item['task_id']}（{item['priority']}｜{item['assignee'] or '未指定执行人'}）"
            for item in unclaimed[:5]
        )
        if len(unclaimed) > 5:
            preview += f"；...共{len(unclaimed)}项"
        messages.append(f"未认领待办: {preview}")
    else:
        messages.append("未认领待办: 无")

    if high_pending:
        high_preview = "；".join(item["task_id"] for item in high_pending[:5])
        if len(high_pending) > 5:
            high_preview += f"；...共{len(high_pending)}项"
        messages.append(f"高优任务提示: {high_preview}")

    return "\n".join(messages)


# ─────────────────────────────────────────────
# 启动服务
# ─────────────────────────────────────────────
if __name__ == "__main__":
    mcp.run(transport="stdio")
