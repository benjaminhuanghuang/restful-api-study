import loaders from "./loaders";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import {
  UserRoutes,
  CarrierRoutes,
  CustomerRoutes,
  DockRoutes,
  ShipmentRoutes,
} from "./api-routes";
import fileupload from "express-fileupload";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";

import dotenv from "dotenv";
dotenv.config();

loaders();

const app = express();

app.use(
  express.json({
    limit: "1mb",
    strict: true,
    type: "application/json",
  }),
);

// parses incoming requests with URL-encoded bodies — the format used when HTML forms submit data
app.use(express.urlencoded({ extended: true, limit: "50kb" }));
// Limit each IP to 100 requests per 15 minutes
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: "draft-7", // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false,
    message:
      "Too many requests from this IP, please try again after 15 minutes",
  }),
);
app.use(mongoSanitize());
app.use(
  fileupload({
    useTempFiles: true,
    tempFileDir: "./v1/src/uploads",
    parseNested: true,
    abortOnLimit: true,
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
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 600,
  }),
);

//
const apiRouter = express.Router();
apiRouter.use("/users", UserRoutes);
apiRouter.use("/carrier", CarrierRoutes);
apiRouter.use("/customer", CustomerRoutes);
apiRouter.use("/dock", DockRoutes);
apiRouter.use("/shipment", ShipmentRoutes);
app.use("/api/v1", apiRouter);

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});

apiRouter.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const error = new Error("There is no such a path") as any;
  error.status = 404;
  next(error);
});
