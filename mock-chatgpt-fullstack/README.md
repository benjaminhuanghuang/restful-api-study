# Mock chatgpt fullstack

模拟，实现 类似 chatgpt

```txt
Client - POST /chat/completions -> API Server - Streaming Request ->  LLM

Client <- SSE: Token/Chunk - API Server <- Token/Chunk -  LLM
```

## Tech stack

## Server

- Typescript 7 + Express
- Streaming API
- A mock LLM generates chunk/token

## Client

- react19 + tailwind4
- auto scrolling

## Technical design

- Streaming API
- Streaming response
- Incremental response generation
- Token streaming
- Real-time streaming
- Server-Sent Events (SSE)

The basic architecture is Client → Server → LLM. The LLM generates tokens incrementally, and the server forwards those chunks to the client over a long-lived HTTP streaming connection, commonly using SSE. The client appends each chunk to the current message and renders it immediately.

### Backend

- Streaming: 不要等 LLM 全部生成完再返回。LLM 产生一个 chunk/token，就尽快 forward 给 client。 常见方案：SSE。
- Connection lifecycle: 要处理 client disconnect。 Client 取消生成后，server 应该停止继续调用 LLM，避免浪费资源。
- Backpressure: Client 处理得慢时，要避免 server 无限 buffering。 控制 buffer 和 connection timeout。
- Error handling: LLM 中途报错、timeout、rate limit，都要能告诉 client。 最好有明确的 error / done event。
- Request ID / Stream ID: 每个请求有唯一 ID，方便 logging、debugging 和 tracing。 如果需要 resume，可以给 chunk 加 sequence number。
- Timeout & resource management: Streaming connection 可能持续很久。要限制最大 duration，并及时释放连接和 LLM resources。

### Frontend

- Incremental rendering: 收到 chunk 就 append 到当前 message。 不要每个 token 都触发非常昂贵的 UI rendering，可以适当 batch。
- Cancel: 用户点击 Stop 时，要取消 streaming request。 同时通知 backend 停止 LLM generation。
- Disconnect / reconnect: 网络断开时，要区分：
  stream 已经结束
  stream 中途断开
  request 本身失败
- Partial response: Streaming 中途失败时，UI 可能已经显示了一半内容。 不应该简单把已有内容清掉。
- Ordering: 如果支持 reconnect/resume，需要保证 chunk 顺序。 可以通过 sequence number 检查有没有丢 chunk。
- Final state: Stream 完成后，要把 message 从 streaming 状态变成 completed。
  如果失败，则变成 failed，方便 retry。

## Questions

### What do you need to consider when designing a streaming API?

On the backend, we need to handle connection lifecycle, cancellation, backpressure, errors, and resource cleanup.

On the frontend, we need incremental rendering, cancellation, partial responses, and reconnect handling.

We also need request IDs and possibly sequence numbers if we want to support reliable resume.

### SSE 和 WebSocket 为什么选 SSE

### Client render performance
