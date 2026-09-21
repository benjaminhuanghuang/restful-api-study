import { app } from "./app.ts";
import { env } from "./config/env.ts";
import { connectDB } from "./db/connection.ts";

async function main() {
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT} [${env.NODE_ENV}]`);
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
