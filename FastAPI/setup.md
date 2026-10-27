# FastAPI Setup

```sh
which python3
python3 -m venv .venv3

source ./.venv3/bin/activate
pip install fastapi
```

requirements.txt

```txt
fastapi[standard]
uvicorn[standard]
```

FastAPI 基于 Starlette，Starlette 实现了 ASGI (Asynchronous Server Gateway Interface)规范；uvicorn 是实现了 ASGI 协议的服务器，
`[standard]`定义了uvicorn 的依赖
uvloop — 更快的事件循环（替代标准 asyncio）
httptools — 更快的 HTTP 解析
websockets — WebSocket 支持
watchfiles — --reload 文件变更监听
python-dotenv — 读取 .env
pyyaml — 日志配置文件解析

## Run

```sh
uvicorn main:app --reload
```
