import { ICarrier } from "../interfaces/models";
import CarrierService from "../services/CarrierService";
import BaseController from "./baseController";
import { Request, Response } from "express";

class CarriersController extends BaseController {
  constructor() {
    super(CarrierService, "Carrier", "name", true);
  }

  update = (req: Request, res: Response) => {
    const { name, _id } = req.body;
    try {
      this.service
        .findOne({
          user_id: req.user.id,
          name: name,
          _id,
        })
        .then((existingCarrier: ICarrier) => {
          if (!existingCarrier)
            return this.APIResponseMessages.noRecordsFound(res);
          if (existingCarrier.name === name) {
            this.service
              .update(req.user.id, existingCarrier._id.toString(), req.body)
              .then((updatedCarrier: ICarrier) => {
                return this.APIResponseMessages.updated(res, updatedCarrier);
              });
          } else {
            this.service
              .countDocuments(req.user.id, { name })
              .then((count: number) => {
                if (count === 0) {
                  this.service
                    .update(
                      req.user.id,
                      existingCarrier._id.toString(),
                      req.body,
                    )
                    .then((updatedCarrier: ICarrier) => {
                      return this.APIResponseMessages.updated(
                        res,
                        updatedCarrier,
                      );
                    });
                } else {
                  return this.APIResponseMessages.alreadyExists(
                    res,
                    `Carrier with same name(${name}) already exists`,
                  );
                }
              });
          }
        });
    } catch (error) {
      return this.APIResponseMessages.errorOccurred(res, error as Error);
    }
  };

  numberOfCarriers = async (req: Request, res: Response) => {
    try {
      const count = await this.service.countDocuments(req.user.id, {
        deleted: false,
      });
      return this.APIResponseMessages.custom(res, { count });
    } catch (error) {
      return this.APIResponseMessages.errorOccurred(res, error as Error);
    }
  };

  uniqueCarrierFilterData = () => {};

  list = () => {};

  uploadCarriers = () => {};

  getCarriers = async (req: Request, res: Response) => {
    try {
      const carriers: ICarrier[] = await this.service.baseModel.find(
        { user_id: req.user.id, deleted: false },
        "_id name",
      );
      return this.APIResponseMessages.listed(res, carriers);
    } catch (error) {
      return this.APIResponseMessages.errorOccurred(res, error as Error);
    }
  };
}

export default new CarriersController();
