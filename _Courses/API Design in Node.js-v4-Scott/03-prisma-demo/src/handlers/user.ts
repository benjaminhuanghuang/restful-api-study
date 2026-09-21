import prisma from "../db";
import { Request, Response } from "express";
import { createJWT, comparePassword, hashPassword } from "../modules/auth";

export const createNewUser = async (req: Request, res: Response) => {
  const user = await prisma.user.create({
    data: {
      username: req.body.username,
      password: hashPassword(req.body.password),
    },
  });
  const token = createJWT(user);
  res.json({ token });
};

export const signIn = async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: {
      username: req.body.username,
    },
  });
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  const valid = await comparePassword(req.body.password, user.password);
  if (!valid) {
    res.status(401).json({ message: "Invalid password" });
    return;
  }
  const token = createJWT(user);
  res.json({ token });
};
