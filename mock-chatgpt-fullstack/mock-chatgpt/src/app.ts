import cors from "cors";
import express from "express";
import { env } from "./config/env.ts";
import { errorHandler } from "./middlewares/errorHandler.ts";
import { notFound } from "./middlewares/notFound.ts";
import { chatRoutes } from "./routes/chatRoutes.ts";

export const app = express();

app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/chat", chatRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
