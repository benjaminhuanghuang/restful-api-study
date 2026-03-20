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
  creationLimitBy: string | undefined;
  softDelete: boolean;
  services: { [key: string]: ServiceType };

  constructor(
    service: ServiceType,
    field: string,
    creationLimitBy?: string | undefined,
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

  create = (req: Request, res: Response) => {
    let where: { [key: string]: string } = {};

    try {
      if (this.creationLimitBy)
        where[this.creationLimitBy] = req.body[this.creationLimitBy];

      this.service.findOne(where).then((response: object) => {
        if (!response) {
          // if no existing record found
          this.service
            .create(req.body)
            .then((response: object) => {
              this.APIResponseMessages.created(res, response);
            })
            .catch((error: Error) => {
              this.APIResponseMessages.errorOccurred(res, error);
            });
        } else {
          if (this.creationLimitBy) {
            this.APIResponseMessages.alreadyExists(
              res,
              req.body[this.creationLimitBy],
            );
          }
        }
      });
    } catch (error) {
      this.APIResponseMessages.errorOccurred(res, error as Error);
    }
  };

  update = (req: Request, res: Response) => {
    this.service
      .update((req as any).user?._id, req.body._id, req.body)
      .then((updated) => {
        if (updated) {
          this.APIResponseMessages.updated(res, updated);
        } else {
          this.APIResponseMessages.noRecordsFound(res);
        }
      })
      .catch((e: Error) => this.APIResponseMessages.errorOccurred(res, e));
  };

  delete = (req: Request, res: Response) => {
    if (this.softDelete === false) {
      this.service
        .delete((req as any).user?._id, req.params.id as string)
        .then((deleted) => {
          if (deleted) {
            this.APIResponseMessages.deleted(res, deleted);
          } else {
            this.APIResponseMessages.noRecordsFound(res);
          }
        })
        .catch((e: Error) => this.APIResponseMessages.errorOccurred(res, e));
    } else {
      req.body.deleted = true;
      this.service
        .update((req as any).user?._id, req.params.id as string, req.body)
        .then((deleted) => {
          if (deleted) {
            this.APIResponseMessages.deleted(res, deleted);
          } else {
            this.APIResponseMessages.noRecordsFound(res);
          }
        })
        .catch((e: Error) => this.APIResponseMessages.errorOccurred(res, e));
    }
  };

  list = (req: Request, res: Response) => {
    const filter: any = { user_id: (req as any).user._id };

    if (this.softDelete) {
      filter.deleted = false;
    }

    this.service
      .list(filter)
      .then((list) => {
        this.APIResponseMessages.listed(res, list);
      })
      .catch((e: Error) => this.APIResponseMessages.errorOccurred(res, e));
  };
}

export default BaseController;
