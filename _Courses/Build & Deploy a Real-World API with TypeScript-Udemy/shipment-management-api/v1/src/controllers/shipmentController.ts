import { Request, Response } from "express";
import ShipmentService from "../services/ShipmentService";
import BaseController from "./baseController";
import { Error, Types } from "mongoose";
import IShipment from "../interfaces/models/IShipment";

class ShipmentController extends BaseController {
  constructor() {
    super(ShipmentService, "Shipment", "load_code", true);
  }

  create = (req: Request, res: Response) => {
    const { load_code } = req.body;

    this.service
      .findOne({ load_code: load_code, user_id: (req as any).user?.id })
      .then((response: object) => {
        if (!response) {
          Object.assign(req.body, { user_id: (req as any).user?.id });
          this.service.create(req.body).then((createdShipment: IShipment) => {
            createdShipment
              .populate("carrier destination dock sub_shipments")
              .then((populatedShipment) => {
                this.APIResponseMessages.created(res, populatedShipment);
              });
          });
        } else {
          this.APIResponseMessages.alreadyExists(res, load_code);
        }
      });
  };

  update = (req: Request, res: Response) => {
    const { load_code, _id } = req.body;
    try {
      this.service
        .findOne({
          user_id: (req as any).user?.id,
          _id: new Types.ObjectId(_id),
        })
        .then((shipment: IShipment) => {
          if (shipment) {
            if (shipment.load_code === load_code) {
              this.service
                .update((req as any).user?._id, req.body._id, req.body)
                .then((updatedShipment) => {
                  updatedShipment
                    .populate("carrier destination dock sub_shipments")
                    .then((populatedShipment: IShipment) => {
                      let availabilityOfTheDock = true;
                      if (req.body.status == 2) {
                        // arrived
                        availabilityOfTheDock = false;
                      }
                      this.services["DockService"].update(
                        (req as any).user?._id,
                        populatedShipment.dock._id,
                        { available: availabilityOfTheDock },
                      );
                      return this.APIResponseMessages.updated(
                        res,
                        populatedShipment,
                      );
                    });
                });
            } else {
              this.service
                .countDocuments((req as any).user?.id, { load_code: load_code })
                .then((count: number) => {
                  if (count) {
                    return this.APIResponseMessages.alreadyExists(
                      res,
                      load_code,
                    );
                  } else {
                    this.service
                      .update((req as any).user?._id, req.body._id, req.body)
                      .then((updatedShipment) => {
                        updatedShipment
                          .populate("carrier destination dock sub_shipments")
                          .then((populatedShipment: IShipment) => {
                            let availabilityOfTheDock = true;
                            if (req.body.status == 2) {
                              // arrived
                              availabilityOfTheDock = false;
                            }
                            this.services["DockService"].update(
                              (req as any).user?._id,
                              populatedShipment.dock._id as string,
                              { available: availabilityOfTheDock },
                            );
                            return this.APIResponseMessages.updated(
                              res,
                              populatedShipment,
                            );
                          });
                      });
                  }
                });
            }
          } else {
            this.APIResponseMessages.noRecordsFound(res);
          }
        });
    } catch (error) {
      return this.APIResponseMessages.errorOccurred(res, error as Error);
    }
  };

  list = (req: Request, res: Response) => {};

  addSubShipment = (req: Request, res: Response) => {
    if (!req.params.id)
      return this.APIResponseMessages.badRequest(
        res,
        "Shipment ID is required",
      );

    try {
      this.service
        .findOne({ user_id: (req as any).user?.id, _id: req.params.id })
        .then((parentShipment: IShipment) => {
          if (!parentShipment)
            return this.APIResponseMessages.custom(
              res,
              "Parent shipment not found",
            );

          if (parentShipment.is_sub_shipment)
            return this.APIResponseMessages.custom(
              res,
              "Cannot add sub-shipments to a sub-shipment",
            );

          Object.assign(req.body, {
            user_id: (req as any).user?.id,
            is_sub_shipment: true,
          });

          this.service
            .create(req.body)
            .then((createdSubShipment: IShipment) => {
              parentShipment.sub_shipments.push(createdSubShipment._id);
              parentShipment.save().then((updatedParentShipment) => {
                updatedParentShipment
                  .populate("carrier destination dock sub_shipments")
                  .then((populatedShipment: IShipment) => {
                    return this.APIResponseMessages.updated(
                      res,
                      populatedShipment,
                    );
                  });
              });
            });
        });
    } catch (error) {
      return this.APIResponseMessages.errorOccurred(res, error as Error);
    }
  };

  updateSubShipment = (req: Request, res: Response) => {
    try {
      if (!req.params.parentShipmentId || !req.params.subShipmentId) {
        return this.APIResponseMessages.badRequest(
          res,
          "Parent Shipment ID and Sub-Shipment ID are required",
        );
      }

      this.service
        .findOne({
          user_id: (req as any).user?.id,
          _id: req.params.subShipmentId,
        })
        .then((subShipment: IShipment) => {
          if (!subShipment) {
            return this.APIResponseMessages.custom(
              res,
              "Sub-Shipment not found",
            );
          }

          this.service
            .update((req as any).user?.id, req.params.subShipmentId, req.body)
            .then((updatedSubShipment) => {
              this.service
                .findOne({
                  user_id: (req as any).user?.id,
                  _id: req.params.parentShipmentId,
                })
                .populate("carrier destination dock sub_shipments")
                .then((populatedParentShipment: IShipment) => {
                  return this.APIResponseMessages.updated(
                    res,
                    populatedParentShipment,
                  );
                });
            });
        });
    } catch (error) {
      return this.APIResponseMessages.errorOccurred(res, error as Error);
    }
  };

  arrivedShipments = (req: Request, res: Response) => {};

  todaysShipments = (req: Request, res: Response) => {};

  shipmentStatistics = (req: Request, res: Response) => {};

  statusOfAllShipments = (req: Request, res: Response) => {};

  numberOfShipments = (req: Request, res: Response) => {};

  uniqueFilteringData = (req: Request, res: Response) => {};
}

export default new ShipmentController();
