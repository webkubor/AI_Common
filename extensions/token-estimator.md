# Token Estimator Skill (上下文负载估算器)

## 🎯 核心逻辑
当用户询问“Token 消耗”、“Context 大小”、“记忆库多大”时，执行本技能。
本技能通过统计**本地静态文件**的字符数，估算若将这些内容加载到 LLM 上下文中的**潜在 Token 消耗**。

> **注意**: 这是一个**静态估算**，不包含由于多轮对话产生的动态历史记录 (History)。

## ⚙️ 估算脚本 (Shell)
执行以下命令，统计 `AI_Common` 核心区与当前项目的“重量”：

```bash
# 定义估算函数 (粗略：中文按1，英文按0.3，平均按 0.5 字符/Token 估算，或直接用 wc -c 字节数/3)
# 这里采用更通用的估算：总字符数 / 2 (保守估计)

echo "📊 Context 负载估算报告"
echo "----------------------------------------"
printf "% -30s | % -10s | % -10s\n" "模块 (Module)" "字符数" "Est. Tokens"
echo "----------------------------------------"

# 1. 公共大脑 (Rules & Index)
COMMON_FILES=$(find ~/Documents/AI_Common/rules ~/Documents/AI_Common/index.md ~/Documents/AI_Common/tech_stack.md -type f)
COMMON_CHARS=$(cat $COMMON_FILES | wc -m | tr -d ' ')
COMMON_TOKENS=$((COMMON_CHARS / 2))
printf "% -30s | % -10s | % -10s\n" "🧠 公共大脑 (Rules)" "$COMMON_CHARS" "$COMMON_TOKENS"

# 2. 复盘记忆 (Retrospective)
RETRO_FILE=~/Documents/AI_Common/retrospective.md
if [ -f "$RETRO_FILE" ]; then
    RETRO_CHARS=$(cat "$RETRO_FILE" | wc -m | tr -d ' ')
    RETRO_TOKENS=$((RETRO_CHARS / 2))
    printf "% -30s | % -10s | % -10s\n" "📝 复盘记忆 (Retro)" "$RETRO_CHARS" "$RETRO_TOKENS"
else
    RETRO_TOKENS=0
    printf "% -30s | % -10s | % -10s\n" "📝 复盘记忆 (Retro)" "0" "0"
fi

# 3. 技能定义 (Extensions)
EXT_FILES=$(find ~/Documents/AI_Common/extensions -name "*.md" -type f)
EXT_CHARS=$(cat $EXT_FILES | wc -m | tr -d ' ')
EXT_TOKENS=$((EXT_CHARS / 2))
printf "% -30s | % -10s | % -10s\n" "🛠 技能定义 (Extensions)" "$EXT_CHARS" "$EXT_TOKENS"

echo "----------------------------------------"
TOTAL_TOKENS=$((COMMON_TOKENS + RETRO_TOKENS + EXT_TOKENS))
echo "👉 静态记忆总库 (Total Static): ~ $TOTAL_TOKENS Tokens"
echo "💡 (注: 仅包含 AI_Common 核心文件，不含项目代码与历史对话)"
```

## 📈 输出格式

```text
📊 Context 负载估算报告
----------------------------------------
模块 (Module)                  | 字符数     | Est. Tokens
----------------------------------------
🧠 公共大脑 (Rules)            | 15200      | 7600
📝 复盘记忆 (Retro)            | 2400       | 1200
🛠 技能定义 (Extensions)       | 5600       | 2800
----------------------------------------
👉 静态记忆总库 (Total Static): ~ 11600 Tokens
```

## 建议
- 如果 **复盘记忆** > 3000 Tokens，建议立即执行 `/retro` 触发 GC。
- 如果 **公共大脑** > 10000 Tokens，建议精简规则文档。
