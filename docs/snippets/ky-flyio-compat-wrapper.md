# Ky 模拟 Flyio 拦截器封装
用于在迁移项目中保持原有业务逻辑（如 code 检查、SUCCESS 字符检查）同时享受 Ky 的现代特性。

```typescript
// See th-payment-web/src/utils/request.ts for implementation
// 支持 code: 200 返回全量, msg: 'SUCCESS' 返回 data, 自动处理 Accept-Language
```
