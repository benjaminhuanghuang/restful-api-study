import { Router } from "express";
import { streamChat } from "../controllers/chatController.ts";

export const chatRoutes = Router();

chatRoutes.post("/stream", streamChat);
