import validate from "../middlewares/validate";
import authenticate from "../middlewares/authenticate";
import validationSchemas from "../validations/Shipment";
import express from "express";
import Shipment from "../controllers/shipmentController";

const router = express.Router();

router
  .route("/")
  .post(authenticate, validate(validationSchemas.create), Shipment.create);
router
  .route("/")
  .patch(authenticate, validate(validationSchemas.update), Shipment.update);

router
  .route("/:id/add-sub-shipment")
  .post(
    authenticate,
    validate(validationSchemas.addSubShipment),
    Shipment.addSubShipment,
  );

export default router;
