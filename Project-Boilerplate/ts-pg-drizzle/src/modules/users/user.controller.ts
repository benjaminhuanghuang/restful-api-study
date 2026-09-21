import type { Request, Response } from "express";
import { createUserSchema, idParamSchema, updateUserSchema } from "./user.schema.ts";
import { userService } from "./user.service.ts";

export const userController = {
  async list(req: Request, res: Response) {
    const users = await userService.list();
    res.json(users);
  },

  async getById(req: Request, res: Response) {
    const { id } = idParamSchema.parse(req.params);
    const user = await userService.getById(id);
    res.json(user);
  },

  async create(req: Request, res: Response) {
    const input = createUserSchema.parse(req.body);
    const user = await userService.create(input);
    res.status(201).json(user);
  },

  async update(req: Request, res: Response) {
    const { id } = idParamSchema.parse(req.params);
    const input = updateUserSchema.parse(req.body);
    const user = await userService.update(id, input);
    res.json(user);
  },

  async remove(req: Request, res: Response) {
    const { id } = idParamSchema.parse(req.params);
    await userService.remove(id);
    res.status(204).send();
  },
};
