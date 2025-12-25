# cors(Cross-Origin Resource Sharing) middleware

```js
// Anti-CORS middleware
app.use((req, res, next) => {
  // Allows requests from any domain
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Allows actions
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  // Allows request headers
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});
```
