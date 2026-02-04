# Consistent Persona System (一致性人像系统)

> **Context**: UCD Standard for Personal Branding & Storytelling.
> **Purpose**: Maintain character identity across multiple AI-generated images.

## 1. The "Anchor String" Method (锚点法)
To maintain identity across different generated images, define and lock a **Base Persona String**.

*   **Structure**: `[Core Identity] + [Fixed Features] + [Fixed Style] + [Variable Action/Scene]`
*   **Example Anchor**:
    > "A professional female UX designer, asian, mid-20s, black bob hair, wearing minimalist white shirt and silver glasses, soft natural makeup."

## 2. Story Mode (连续故事法)
Use the `generate_story` tool for sequential consistency.

*   **Workflow**:
    1.  Define the character once in the main prompt.
    2.  Describe the sequence of actions clearly.
    3.  Set `--style consistent`.

## 3. Dimensions & Canvas (尺寸与画布)
*   **Aspect Ratio**: **3:4** (Portrait).
*   **Orientation**: Vertical.

## 4. Reference Asset (参考素材)
*   **Primary Reference**: `docs/ucd/girl.png`
*   **Usage Rule**: Always prefer using `edit_image` with this reference file over creating new characters from scratch, to ensure maximum consistency.

## 5. Quality Standards
*   **Lighting**: Cinematic or Soft Window Light (rembrandt lighting).
*   **Skin Texture**: High fidelity, visible pores (avoid plastic/wax skin).
*   **Eyes**: Sharp focus, circular catchlights.
