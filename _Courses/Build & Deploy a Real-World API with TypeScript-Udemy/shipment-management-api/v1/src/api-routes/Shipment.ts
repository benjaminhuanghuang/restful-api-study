import validate from "../middlewares/validate";
import authenticate from "../middlewares/authenticate";
import validationSchemas from "../validations/Dock";
import express from "express";
import Shipment from "../controllers/shipmentController";

const router = express.Router();

router
  .route("/")
  .post(authenticate, validate(validationSchemas.create), Shipment.create);

export default router;
