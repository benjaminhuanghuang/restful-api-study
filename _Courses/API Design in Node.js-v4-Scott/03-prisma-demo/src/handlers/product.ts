import { Request, Response, NextFunction } from "express";

import prisma from "../db";

// Get All
export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      include: {
        products: true,
      },
    });
    res.json({ data: user.products });
  } catch (e) {
    next(e);
  }
};

// Get One
export const getOneProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const product = await prisma.product.findUnique({
      where: {
        id,
        belongsToId: req.user.id,
      },
    });
    res.json({ data: product });
  } catch (e) {
    next(e);
  }
};

export const createNewProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await prisma.product.create({
      data: {
        name: req.body.name,
        belongsToId: req.user.id,
      },
    });
    res.json({ data: product });
  } catch (e) {
    next(e);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedProduct = await prisma.product.update({
      where: {
        id_belongsToId: {
          id: req.params.id,
          belongsToId: req.user.id,
        },
      },
      data: {
        name: req.body?.name,
      },
    });
    res.json({ data: updatedProduct });
  } catch (e) {
    next(e);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deletedProduct = await prisma.product.delete({
      where: {
        id_belongsToId: {
          id: req.params.id,
          belongsToId: req.user.id,
        },
      },
    });
    res.json({ data: deletedProduct });
  } catch (e) {
    next(e);
  }
};
