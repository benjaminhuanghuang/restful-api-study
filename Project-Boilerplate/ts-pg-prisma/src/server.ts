import { app } from "./app.ts";
import { env } from "./config/env.ts";

app.listen(env.PORT, () => {
  console.log(`Server running on http://localhost:${env.PORT} [${env.NODE_ENV}]`);
});
