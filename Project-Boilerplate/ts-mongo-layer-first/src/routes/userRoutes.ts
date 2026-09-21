import { Router } from "express";
import { userController } from "../controllers/userController.ts";

export const userRoutes = Router();

userRoutes.get("/", userController.list);
userRoutes.get("/:id", userController.getById);
userRoutes.post("/", userController.create);
userRoutes.patch("/:id", userController.update);
userRoutes.delete("/:id", userController.remove);
