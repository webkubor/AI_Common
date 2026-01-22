## 2026-01-11: corpus.ts concat 类型推断失败导致构建报错
- **现象**：`vue-tsc -b` 报错，`concat` 参数类型不匹配（dialogue/system 联合类型无法赋值给单一类型）。
- **根因**：`filter` + `map` 生成的数组在 TypeScript 中仍被推断为联合类型，`concat` 需要精确的 `DialogueItem[]` / `SystemItem[]`。
- **解决方案**：对 `map` 使用显式泛型并改用展开数组 `[...preset, ...custom]`，稳定类型推断。
- **规则同步**：涉及联合类型数组合并时，优先用 `map<T>` + 展开数组，避免 `concat` 推断失败。
