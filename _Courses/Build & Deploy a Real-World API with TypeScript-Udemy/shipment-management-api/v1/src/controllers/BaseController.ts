import {
  ICarrier,
  ICustomer,
  IDock,
  IShipment,
  IUser,
} from "../interfaces/models";
import APIResponseMessages from "../scripts/utils/APIResponseMessages";
import { Request, Response } from "express";
import {
  CarrierService,
  CustomerService,
  DockService,
  ShipmentService,
  UserService,
} from "../services";

type ServiceType =
  | typeof CarrierService
  | typeof CustomerService
  | typeof DockService
  | typeof ShipmentService
  | typeof UserService;

class BaseController {
  service: ServiceType;
  APIResponseMessages: APIResponseMessages;
  creationLimitBy: string;
  softDelete: boolean;
  services: { [key: string]: ServiceType };

  constructor(
    service: ServiceType,
    field: string,
    creationLimitBy: string,
    softDelete: boolean = false,
  ) {
    this.service = service;
    this.APIResponseMessages = new APIResponseMessages(field);
    this.creationLimitBy = creationLimitBy;
    this.softDelete = softDelete;
    this.services = {
      CarrierService: CarrierService,
      CustomerService: CustomerService,
      DockService: DockService,
      ShipmentService: ShipmentService,
      UserService: UserService,
    };
  }

  create = async (req: Request, res: Response) => {};

  updated() {}

  delete() {}

  list() {}
}
