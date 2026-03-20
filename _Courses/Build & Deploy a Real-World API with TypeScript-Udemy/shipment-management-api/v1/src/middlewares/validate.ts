import e, { Request, Response, NextFunction } from "express";
import { Schema } from "joi"; // 172.5k (gzipped: 54.3k)
import httpStatuses from "http-status"; // 21.6k (gzipped: 7.6k)

const validate =
  (schema: Schema) => (req: Request, res: Response, next: NextFunction) => {
    const { value, error } = schema.validate(req.body);

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");
      res.status(httpStatuses.BAD_REQUEST).json({ error: errorMessage });
      return;
    }
    Object.assign(req, value);

    next();
  };

export default validate;
