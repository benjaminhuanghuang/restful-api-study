import { Request, Response } from "express";
import ShipmentService from "../services/ShipmentService";
import BaseController from "./baseController";
import { Error, Types } from "mongoose";
import IShipment from "../interfaces/models/IShipment";

class ShipmentController extends BaseController {
  constructor() {
    super(ShipmentService, "Shipment", "load_code", true);
  }

  create = (req: Request, res: Response) => {};

  update = (req: Request, res: Response) => {};

  list = (req: Request, res: Response) => {};

  addSubShipment = (req: Request, res: Response) => {};

  updateSubShipment = (req: Request, res: Response) => {};

  arrivedShipments = (req: Request, res: Response) => {};

  todaysShipments = (req: Request, res: Response) => {};

  shipmentStatistics = (req: Request, res: Response) => {};

  statusOfAllShipments = (req: Request, res: Response) => {};

  numberOfShipments = (req: Request, res: Response) => {};

  uniqueFilteringData = (req: Request, res: Response) => {};
}

export default new ShipmentController();
