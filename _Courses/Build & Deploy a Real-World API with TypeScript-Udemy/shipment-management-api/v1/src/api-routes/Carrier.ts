import validate from "../middlewares/validate";
import authenticate from "../middlewares/authenticate";
import validationSchemas from "../validations/Carrier";
import express from "express";
import Carrier from "../controllers/carrierController";

const router = express.Router();

router
  .route("/")
  .post(authenticate, validate(validationSchemas.create), Carrier.create);
router
  .route("/")
  .patch(authenticate, validate(validationSchemas.update), Carrier.update);

router.route("/number-of-carriers").get(authenticate, Carrier.numberOfCarriers);
router.route("/get-carriers").get(authenticate, Carrier.getCarriers);

export default router;
