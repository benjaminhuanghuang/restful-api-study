# Project structure - layer first

Layer-first(按技术层分组)— 最传统的 MVC 式写法, 小项目/教程常见

缺点:改一个功能要在 4 个文件夹间跳,项目一大就乱, 只适合玩具项目

```text
src/
  config/
    env.ts
    db.ts
  routes/
    userRoutes.ts
    postRoutes.ts
  controllers/
    userController.ts
    postController.ts
  services/
    userService.ts
    postService.ts
  models/
    User.ts
    Post.ts
  middlewares/
    errorHandler.ts
    notFound.ts
  utils/
    AppError.ts
  app.ts
  server.ts
tests/
  user.test.ts
  post.test.ts
```
