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
router
  .route("/:parentShipmentId/update-sub-shipment/:subShipmentId")
  .patch(
    authenticate,
    validate(validationSchemas.updateSubShipment),
    Shipment.updateSubShipment,
  );

router.route("/arrived-shipments").get(authenticate, Shipment.arrivedShipments);
router.route("/todays-shipments").get(authenticate, Shipment.todaysShipments);

router
  .route("/last-week-shipments")
  .get(authenticate, Shipment.numberOfLastWeekShipments);
router
  .route("/this-week-shipments")
  .get(authenticate, Shipment.numberOfThisWeekShipments);
router
  .route("/shipments-in-this-year")
  .get(authenticate, Shipment.numberOfShipmentsInThisYear);
router
  .route("/shipments-in-this-month")
  .get(authenticate, Shipment.numberOfShipmentsInThisMonth);
router
  .route("/status-of-shipments")
  .get(authenticate, Shipment.statusOfAllShipments);
export default router;
