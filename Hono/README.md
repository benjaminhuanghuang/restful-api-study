# Hono

- 核心包体积只有不到 20KB，且零外部依赖（Zero Dependencies）。 自研了非常高效的路由匹配算法（RegExpRouter / SmartRouter），基准测试中路由性能远超 Express，比 Fastify 还要快。
- Hono 抛弃 Node.js 传统的 (req, res) 模式，使用现代 W3C / Web 标准（基于标准的 Request、Response、fetch 和 ReadableStream）。 同一份业务代码，不用改动一行，可以无缝运行在任何支持 Web 标准的环境中。
- 类似 tRPC 的端到端类型安全（Hono RPC）

```ts
// 后端定义
const app = new Hono().get('/api/user', (c) => c.json({ id: 1, name: 'Alice' }))
export type AppType = typeof app
// 前端直接调用（全类型提示！）
import { hc } from 'hono/client'
const client = hc<AppType>('http://localhost:3000')
const res = await client.api.user.$get()
const data = await res.json() // 自动推导 data 类型为 { id: number, name: string }
```

- 内置了对 Server-Sent Events（SSE）的封装, 原生流式输出（Streaming / SSE）—— AI 时代的标配

```ts
import { Hono } from 'hono'
import { streamSSE } from 'hono/streaming'
const app = new Hono()
app.get('/chat', (c) => {
  return streamSSE(c, async (stream) => {
    await stream.writeSSE({ data: 'Hello' })
    await stream.sleep(1000)
    await stream.writeSSE({ data: 'World' })
  })
})
```
