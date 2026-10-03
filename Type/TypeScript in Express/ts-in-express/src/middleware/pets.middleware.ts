import type { Request, Response, NextFunction } from "express";

export const pleaseAuth = (
  req: Request<{}, unknown, {}, { password?: string }>,
  res: Response<{ message: string }>,
  next: NextFunction
) => {
  if (req.query.password === "please") {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

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
