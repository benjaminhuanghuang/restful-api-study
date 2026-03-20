import loaders from "./loaders";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors"; // 5k (gzipped: 2.1k)
import helmet from "helmet"; // 12k (gzipped: 3.1k)
import {
  UserRoutes,
  CarrierRoutes,
  CustomerRoutes,
  DockRoutes,
} from "./api-routes";
import fileupload from "express-fileupload"; // 1.5k (gzipped: 0.5k)

import dotenv from "dotenv";
dotenv.config();

loaders();

const app = express();

app.use(express.json());
// parses incoming requests with URL-encoded bodies — the format used when HTML forms submit data
app.use(express.urlencoded({ extended: true }));
app.use(
  fileupload({
    useTempFiles: true,
    tempFileDir: "./v1/src/uploads",
    parseNested: true,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  }),
);
app.use(helmet());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
  }),
);
app.use(helmet());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
  }),
);

//
const apiRouter = express.Router();
apiRouter.use("/users", UserRoutes);
apiRouter.use("/carrier", CarrierRoutes);
apiRouter.use("/customer", CustomerRoutes);
apiRouter.use("/dock", DockRoutes);
app.use("/api/v1", apiRouter);

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});

apiRouter.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const error = new Error("There is no such a path") as any;
  error.status = 404;
  next(error);
});
