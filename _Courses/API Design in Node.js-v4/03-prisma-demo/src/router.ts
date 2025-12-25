import { Router } from "express";
import { body, oneOf, validationResult } from "express-validator";
import {
  createNewProduct,
  deleteProduct,
  getOneProduct,
  getAllProducts,
  updateProduct,
} from "./handlers/product";

import { handleInputErrors } from "./modules/middleware";

const router = Router();

/*
Product
*/
router.get("/product", getAllProducts);
router.get("/product/:id", getOneProduct);
router.put(
  "/product/:id",
  body("name")
    .isString()
    .withMessage("Should be a string!")
    .isLength({ max: 255 }),
  handleInputErrors,
  updateProduct
);
router.post(
  "/product",
  body("name")
    .isString()
    .withMessage("Should be a string!")
    .isLength({ max: 255 })
    .withMessage("Maximum 255 characters supported!"),
  handleInputErrors,
  createNewProduct
);
router.delete("/product/:id", deleteProduct);

router.delete("/product/:id", (req, res) => {
  res.send("DELETE /products");
});

/*
Update
*/
router.get("/update", (req, res) => {
  res.send("GET /update-point");
});
router.get("/update/:id", (req, res) => {
  res.send("GET /update-point");
});
router.post(
  "/update",
  body("title").optional,
  body("body").exists().isString(),
  (req, res) => {
    res.send("POST /update-point");
  }
);
router.put(
  "/update/:id",
  body("title").optional,
  body("body").exists().isString(),
  body("status").isIn(["IN_PROGRESS", "SHIPPED", "DEPRECATED"]),
  body("version").optional,
  (req, res) => {
    res.send("PUT /update-point");
  }
);
router.delete("/update/:id", (req, res) => {
  res.send("DELETE /update-point");
});

/*
Update Point
*/
router.get("/updatepoint", (req, res) => {
  res.send("GET /update-point");
});
router.get("/updatepoint/:id", (req, res) => {
  res.send("GET /update-point");
});
router.post("/updatepoint", (req, res) => {
  res.send("POST /update-point");
});
router.put(
  "/updatepoint/:id",
  body("name").optional().isString(),
  body("description").optional().isString(),
  (req, res) => {
    res.send("PUT /update-point");
  }
);
router.delete(
  "/updatepoint/:id",
  body("name").optional().isString(),
  body("description").optional().isString(),
  (req, res) => {
    res.send("DELETE /update-point");
  }
);

export default router;
