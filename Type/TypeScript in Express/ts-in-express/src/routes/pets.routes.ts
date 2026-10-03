import type { Router } from "express";
import express from "express";
import { validateNumericId } from "../middleware/pets.middleware";

import { getPets, getPetById } from "../controllers/pets.controllers";

export const petRouter: Router = express.Router();

petRouter.get("/", getPets);
petRouter.get("/:id", validateNumericId, getPetById);
