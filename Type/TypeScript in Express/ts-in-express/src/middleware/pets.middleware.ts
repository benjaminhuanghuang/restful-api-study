import type { Request, Response, NextFunction } from "express";

export const validateNumericId = (
  req: Request<{ id: string }>,
  res: Response<{ message: string }>,
  next: NextFunction
) => {
  const { id } = req.params;
  if (!/^\d+$/.test(id)) {
    res.status(400).json({ message: "Pet ID must be a number" });
  } else {
    next();
  }
};
