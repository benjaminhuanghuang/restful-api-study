import type { Request, Response } from "express";
import { createUserSchema, idParamSchema, updateUserSchema } from "./user.schema.ts";
import { userService } from "./user.service.ts";

export const userController = {
  list(req: Request, res: Response) {
    const users = userService.list();
    res.json(users);
  },

  getById(req: Request, res: Response) {
    const { id } = idParamSchema.parse(req.params);
    const user = userService.getById(id);
    res.json(user);
  },

  create(req: Request, res: Response) {
    const input = createUserSchema.parse(req.body);
    const user = userService.create(input);
    res.status(201).json(user);
  },

  update(req: Request, res: Response) {
    const { id } = idParamSchema.parse(req.params);
    const input = updateUserSchema.parse(req.body);
    const user = userService.update(id, input);
    res.json(user);
  },

  remove(req: Request, res: Response) {
    const { id } = idParamSchema.parse(req.params);
    userService.remove(id);
    res.status(204).send();
  },
};
