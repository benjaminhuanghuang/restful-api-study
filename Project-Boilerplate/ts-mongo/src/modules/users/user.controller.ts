import type { Request, Response } from "express";
import { createUserSchema, updateUserSchema } from "./user.schema.ts";
import { userService } from "./user.service.ts";

export const userController = {
  async list(req: Request, res: Response) {
    const users = await userService.list();
    res.json(users);
  },

  async getById(req: Request, res: Response) {
    const user = await userService.getById(req.params.id as string);
    res.json(user);
  },

  async create(req: Request, res: Response) {
    const input = createUserSchema.parse(req.body);
    const user = await userService.create(input);
    res.status(201).json(user);
  },

  async update(req: Request, res: Response) {
    const input = updateUserSchema.parse(req.body);
    const user = await userService.update(req.params.id as string, input);
    res.json(user);
  },

  async remove(req: Request, res: Response) {
    await userService.remove(req.params.id as string);
    res.status(204).send();
  },
};
