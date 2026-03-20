import loaders from "./loaders";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors"; // 5k (gzipped: 2.1k)
import helmet from "helmet"; // 12k (gzipped: 3.1k)
import { UserRoutes } from "./api-routes";
import dotenv from "dotenv";
dotenv.config();

loaders();

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
  }),
);
app.use(express.json());
// parses incoming requests with URL-encoded bodies — the format used when HTML forms submit data
app.use(express.urlencoded({ extended: true }));

//
const apiRouter = express.Router();
apiRouter.use("/users", UserRoutes);
app.use("/api/v1", apiRouter);

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});

apiRouter.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const error = new Error("There is no such a path") as any;
  error.status = 404;
  next(error);
});
