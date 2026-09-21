# cors(Cross-Origin Resource Sharing) middleware

允许Origin(website, domain)前端 JavaScript 来访问我的后端 API。

浏览器会检查 frontend javascript from localhost:5173 有没有权限访问 API at localhost:3000？

```js
// enable-CORS middleware
app.use((req, res, next) => {
  // Allows requests from any domain
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Allows actions
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE",
  );
  // Allows request headers
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Browser preflight request, respond 200 immediately without reaching route logic
  if (req.method === "OPTIONS") {
    // Don't enter the route/business logic for preflight requests
    return res.sendStatus(200);
  }

  next();
});
```
