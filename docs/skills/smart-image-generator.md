# Smart Image Generator Skill

> **Description**: Intelligent router for image generation tasks. automatically selects the correct UCD standard based on context, saves results to the Desktop, AND uploads to Cloudflare R2.
> **Trigger**: "Generate image", "Make a cover", "Create a persona", "画图", "生成图片".

## 1. 🧠 Context Analysis & Routing (场景分析与路由)

When the user requests an image, analyze keywords to determine the mode:

| Keywords (关键词) | Mode (模式) | Standard File (规范文件) |
| :--- | :--- | :--- |
| `tech`, `code`, `juejin`, `article`, `cover`, `dev`, `掘金`, `封面`, `架构` | **Tech Share Cover** | `docs/ucd/juejin_tech_covers.md` |
| `person`, `human`, `avatar`, `character`, `face`, `girl`, `boy`, `人像`, `角色` | **Persona System** | `docs/ucd/persona_system.md` |
| *Other/Ambiguous* | *General Mode* | (Ask user or use generic best practices) |

## 2. ⚙️ Execution Workflow (执行流程)

### Step 1: Read Standard
Load the matched standard file (`read_file`).

### Step 2: Determine Method (Persona System Specific)
For **Persona System**, check if a reference image exists (`docs/ucd/girl.png` or other specified references).

*   **Scenario A: Reference Image Exists (Preferred)**
    *   **Action**: Use `edit_image`.
    *   **Logic**: Create a temp copy of the reference -> Edit using prompt -> Output.
    *   **Prompt**: `Change pose/action to [User Description], keeping facial features and style consistent.`
*   **Scenario B: No Reference (Fallback)**
    *   **Action**: Use `generate_image`.
    *   **Prompt**: `[User Description] + [Anchor String/Standard Style] + [Dimensions: 3:4]`

### Step 3: Construct Prompt & Execute
*   **Tech Cover**: `generate_image` -> `[User Subject] + [Standard Prompt Template] + [Dimensions: 16:9]`
*   **Persona**: See Step 2 logic.

### Step 4: Post-Processing (Save & Upload)
1.  **Move**: `mv [Generated_Path] ~/Desktop/[Meaningful_Name].png`
2.  **Upload**: `curl -X POST -F "file=@/Users/webkubor/Desktop/[Meaningful_Name].png" https://r2-upload-proxy.webkubor.workers.dev/`
3.  **Cleanup**: If a temp reference file was used, delete it.
4.  **Output**: Return **Local Path** and **Remote URL**.

## 3. 📝 Example Dialogs

**User**: "Help me generate a cover for my article on React Hooks."
**Agent**:
1.  Detects "Tech Share Cover".
2.  Generates using `juejin_tech_covers.md`.
3.  Uploads & Returns URL.

**User**: "Make the girl do a thumbs up."
**Agent**:
1.  Detects "Persona System".
2.  Finds `docs/ucd/girl.png`.
3.  Copies to temp -> `edit_image` ("Girl doing thumbs up...") -> Uploads.
4.  Returns URL.
