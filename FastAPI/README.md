# FastAPI

FastAPI 站在了两个强大的 Python 库之上：

- Starlette：负责处理高性能的 Web 路由、HTTP/WebSocket 协议及 ASGI 异步底层。
- Pydantic：利用 Python 原生的类型提示（Type Hints），负责请求数据的自动校验、序列化与转换。

FastAPI 原生是专门为构建 RESTful API 设计的框架，但它完全可以通过集成第三方库（如 Strawberry）非常优雅地支持 GraphQL。

自动生成交互式 API 文档： 项目启动后，直接访问 /docs 就能打开 Swagger UI 界面，支持在网页上直接发送请求调试 API； 访问 /redoc 可查看另一种风格的 ReDoc 文档。

强大的数据自动校验（基于 Pydantic）

原生支持异步（Async / Await）

灵活的依赖注入系统（Dependency Injection）：用极简优雅的方式处理数据库 Session 管理、用户认证（JWT）、权限控制等。
