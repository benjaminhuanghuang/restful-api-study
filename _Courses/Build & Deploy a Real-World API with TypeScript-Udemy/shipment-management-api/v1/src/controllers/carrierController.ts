import CarrierService from "../services/CarrierService";
import BaseController from "./baseController";

class Carriers extends BaseController {
  constructor() {
    super(CarrierService, "Carrier", "name", true);
  }

  update = () => {};

  numberOfCarriers = () => {};

  uniqueCarrierFilterData = () => {};

  list = () => {};

  uploadCarriers = () => {};

  getCarriers = () => {};
}
