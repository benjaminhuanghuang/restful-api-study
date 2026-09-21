import express from "express";
import router from "./router";
import morgan from "morgan";
import cors from "cors";
import { protect } from "./modules/auth";
import { createNewUser, signIn } from "./handlers/user";

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200);
  res.json({ message: "Hello, world!" });
});
app.use("/api", protect, router);

app.use("/user", createNewUser);
app.use("/signin", signIn);

app.use(
  (
    err: Error & { type: string },
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err);
    if (err.type === "auth") {
      res.status(401).json({ error: "Unauthorized Access!" });
    } else if (err.type === "input") {
      res.status(400).json({ error: "Invalid Input!" });
    } else {
      res.status(500).json({ error: "Something's wrong with the server" });
    }
  }
);

export default app;
