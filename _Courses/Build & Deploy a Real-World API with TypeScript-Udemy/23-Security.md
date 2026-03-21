# Security

```js
app.use(
  express.json({
    limit: "1mb",
    strict: true,
    type: "application/json",
  }),
);

app.use(express.urlencoded({ extended: true, limit: "50kb" }));

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"], //
  }),
);
```

## Rate limit

```sh
npm i express-rate-limit
```

```js
import rateLimit from "express-rate-limit";

app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })); // Limit each IP to 100 requests per 15 minutes
```

## Mongoose sanitize

```sh
npm i express-mongo-sanitize
```

```js
import mongoSanitize from "express-mongo-sanitize";

app.use(mongoSanitize());
```
