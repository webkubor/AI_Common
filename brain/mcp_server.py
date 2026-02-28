import os
import requests
from datetime import datetime
from pathlib import Path
from fastmcp import FastMCP

# Define base directory
BASE_DIR = Path(__file__).parent.parent
SECRETS_DIR = BASE_DIR / "brain" / "secrets"
KNOWLEDGE_DIR = BASE_DIR / "docs" / "memory" / "知识"

# Ensure directories exist
SECRETS_DIR.mkdir(parents=True, exist_ok=True)
KNOWLEDGE_DIR.mkdir(parents=True, exist_ok=True)

# Initialize FastMCP Server
mcp = FastMCP("Personal-Brain-MCP")

@mcp.tool()
def list_secrets() -> list[str]:
    """List all available secret files."""
    if not SECRETS_DIR.exists():
        return []
    return [f.name for f in SECRETS_DIR.iterdir() if f.is_file() and not f.name.startswith('.')]

@mcp.tool()
def read_secret(name: str) -> str:
    """Read contents of a specific secret file.
    
    Args:
        name: Name of the secret file (e.g. 'github.md', 'lark.env')
    """
    secret_path = SECRETS_DIR / name
    if not secret_path.exists():
        return f"Error: Secret '{name}' does not exist."
    try:
        return secret_path.read_text(encoding='utf-8')
    except Exception as e:
        return f"Error reading secret: {e}"

@mcp.tool()
def write_secret(name: str, content: str) -> str:
    """Create or update a secret file.
    
    Args:
        name: Name of the secret file
        content: The content to write
    """
    secret_path = SECRETS_DIR / name
    try:
        secret_path.write_text(content, encoding='utf-8')
        return f"Successfully wrote secret to {name}"
    except Exception as e:
        return f"Error writing secret: {e}"

@mcp.tool()
def list_knowledge() -> list[str]:
    """List all knowledge review files."""
    if not KNOWLEDGE_DIR.exists():
        return []
    return [f.name for f in KNOWLEDGE_DIR.iterdir() if f.is_file() and not f.name.startswith('.')]

@mcp.tool()
def read_knowledge(name: str) -> str:
    """Read contents of a specific knowledge review file.
    
    Args:
        name: Name of the knowledge file (e.g. 'architecture.md')
    """
    knowledge_path = KNOWLEDGE_DIR / name
    if not knowledge_path.exists():
        return f"Error: Knowledge file '{name}' does not exist."
    try:
        return knowledge_path.read_text(encoding='utf-8')
    except Exception as e:
        return f"Error reading knowledge: {e}"

@mcp.tool()
def write_knowledge(name: str, content: str) -> str:
    """Create or update a knowledge review file.
    
    Args:
        name: Name of the knowledge file (must end in .md)
        content: The markdown content to write
    """
    if not name.endswith('.md'):
        name += '.md'
    knowledge_path = KNOWLEDGE_DIR / name
    try:
        knowledge_path.write_text(content, encoding='utf-8')
        return f"Successfully wrote knowledge to {name}"
    except Exception as e:
        return f"Error writing knowledge: {e}"

@mcp.tool()
def search_knowledge(query: str) -> list[dict]:
    """Search knowledge review files for a specific query string.
    
    Args:
        query: The string to search for
    """
    results = []
    if not KNOWLEDGE_DIR.exists():
        return results
        
    for file_path in KNOWLEDGE_DIR.iterdir():
        if file_path.is_file() and not file_path.name.startswith('.'):
            try:
                content = file_path.read_text(encoding='utf-8')
                if query.lower() in content.lower():
                    results.append({
                        "file": file_path.name,
                        "match_found": True
                    })
            except Exception:
                continue
    return results

@mcp.tool()
def send_lark_notification(title: str, body: str) -> str:
    """Send a notification to Lark (飞书).
    
    Args:
        title: The title of the notification
        body: The main content of the notification
    """
    env_path = SECRETS_DIR / "lark.env"
    if not env_path.exists():
        return "Error: lark.env not found in secrets directory."
    
    webhook_url = None
    try:
        content = env_path.read_text(encoding='utf-8')
        for line in content.splitlines():
            if line.startswith("LARK_WEBHOOK_URL="):
                webhook_url = line.split("=", 1)[1].strip()
                break
    except Exception as e:
        return f"Error reading config: {e}"

    if not webhook_url:
        return "Error: LARK_WEBHOOK_URL not configured."

    now = datetime.now()
    current_hour = now.hour
    
    if current_hour < 10 or current_hour >= 20:
        return "Notification skipped: outside of working hours (10:00 - 20:00)."

    payload = {
        "msg_type": "post",
        "content": {
            "post": {
                "zh_cn": {
                    "title": f"🧠 大脑同步: {title}",
                    "content": [[{"tag": "text", "text": body[:1000]}]]
                }
            }
        }
    }

    try:
        response = requests.post(webhook_url, json=payload)
        if response.status_code == 200:
            return "Successfully sent Lark notification."
        else:
            return f"Failed to send notification. HTTP Status: {response.status_code}, Response: {response.text}"
    except Exception as e:
        return f"Error sending request: {e}"

@mcp.tool()
def log_action(task: str, command: str, success: bool, citations: list[str] = None) -> str:
    """Log an agent action to the physical log file.
    
    Args:
        task: Description of the task performed
        command: The command or core action executed
        success: Whether the action was successful
        citations: Optional list of reference files/paths used
    """
    actions_dir = BASE_DIR / "docs" / "memory" / "logs" / "raw"
    actions_dir.mkdir(parents=True, exist_ok=True)
    
    today = datetime.now().strftime("%Y-%m-%d")
    log_file = actions_dir / f"candy-{today}.md"
    
    if not log_file.exists():
        log_file.write_text(f"# 小烛行动日志 - {today}\n\n", encoding='utf-8')
        
    cites = ", ".join([f"`{c}`" for c in citations]) if citations else "⚠️ 逻辑推演 (无物理引用)"
    timestamp = datetime.now().strftime("%Y/%m/%d %H:%M:%S")
    
    entry = f"\n### ⚡️ 物理操作 - {timestamp}\n- **任务**: {task}\n- **参考**: {cites}\n- **执行**: `{command}`\n- **结果**: {'✅' if success else '❌'}\n---\n"
    
    try:
        with open(log_file, "a", encoding='utf-8') as f:
            f.write(entry)
        return "Successfully logged action."
    except Exception as e:
        return f"Error writing log: {e}"

if __name__ == "__main__":
    mcp.run()
