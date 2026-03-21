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

  arrivedShipments = (req: Request, res: Response) => {
    this.service
      .list({
        status: 2,
        user_id: (req as any).user?._id,
        is_sub_shipment: false,
      })
      .populate("carrier destination dock")
      .then((arrivedShipments: IShipment[]) => {
        this.APIResponseMessages.listed(res, arrivedShipments);
      })
      .catch((e: Error) => this.APIResponseMessages.errorOccurred(res, e));
  };

  todaysShipments = (req: Request, res: Response) => {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1,
    );

    this.service
      .list({
        user_id: (req as any).user?.id,
        pickup_time: { $gte: startOfDay, $lt: endOfDay },
        is_sub_shipment: false,
      })
      .populate("carrier destination dock")
      .then((todaysShipments: IShipment[]) => {
        this.APIResponseMessages.listed(res, todaysShipments);
      })
      .catch((e: Error) => this.APIResponseMessages.errorOccurred(res, e));
  };

  numberOfLastWeekShipments = async (req: Request, res: Response) => {
    try {
      const now = new Date();

      const utcDayIndex = (now.getUTCDay() + 6) % 7; // Monday=0, Tuesday=1, ..., Sunday=6

      // 12.01.2026 00:00:00
      const startOfThisWeek = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate() - utcDayIndex,
          0,
          0,
          0,
        ),
      );

      const startOfLastWeek = new Date(startOfThisWeek);
      startOfLastWeek.setUTCDate(startOfThisWeek.getUTCDate() - 7);

      const endOfLastWeek = startOfLastWeek;

      const results = await this.service.baseModel.aggregate([
        {
          $match: {
            user_id: (req as any).user?.id,
            is_sub_shipment: false,
            status: 3, // shipped
            pickup_time: {
              $gte: startOfLastWeek,
              $lt: endOfLastWeek,
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$pickup_time" },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
        {
          $project: {
            _id: 0,
            date: "$_id",
            count: 1,
          },
        },
      ]);

      const dayLabels = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];

      const countsByDate = results.reduce((acc: any, { date, count }: any) => {
        acc[date] = count;
        return acc;
      });

      const labels: string[] = [];
      const data: number[] = [];

      for (
        let d = new Date(startOfLastWeek);
        d < endOfLastWeek;
        d.setDate(d.getDate() + 1)
      ) {
        const iso = d.toISOString().slice(0, 10);
        labels.push(dayLabels[d.getDay() === 0 ? 6 : d.getDay() - 1]); // Sunday correction
        data.push(countsByDate[iso] || 0);
      }

      return this.APIResponseMessages.custom(res, {
        labels,
        datasets: [
          {
            label: "Last week`s shipped shipments",
            data,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          },
        ],
      });
    } catch (error) {
      return this.APIResponseMessages.errorOccurred(res, error as Error);
    }
  };

  numberOfThisWeekShipments = async (req: Request, res: Response) => {
    try {
      const now = new Date();
      const utcDayIndex = (now.getUTCDay() + 6) % 7; // Monday=0, Tuesday=1, ..., Sunday=6

      const startOfThisWeek = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate() - utcDayIndex,
          0,
          0,
          0,
        ),
      );
      const endOfThisWeek = new Date(startOfThisWeek);
      endOfThisWeek.setUTCDate(startOfThisWeek.getUTCDate() + 7);

      const results = await this.service.baseModel.aggregate([
        {
          $match: {
            user_id: (req as any).user?.id,
            is_sub_shipment: false,
            status: 3, // shipped
            pickup_time: {
              $gte: startOfThisWeek,
              $lt: endOfThisWeek,
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$pickup_time" },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
        {
          $project: {
            _id: 0,
            date: "$_id",
            count: 1,
          },
        },
      ]);

      const dayLabels = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];

      const countsByDate = results.reduce((acc: any, { date, count }: any) => {
        acc[date] = count;
        return acc;
      });

      const labels: string[] = [];
      const data: number[] = [];

      for (
        let d = new Date(startOfThisWeek);
        d < endOfThisWeek;
        d.setDate(d.getDate() + 1)
      ) {
        const iso = d.toISOString().slice(0, 10);
        labels.push(dayLabels[d.getDay() === 0 ? 6 : d.getDay() - 1]); // Sunday correction
        data.push(countsByDate[iso] || 0);
      }

      return this.APIResponseMessages.custom(res, {
        labels,
        datasets: [
          {
            label: "This week`s shipped shipments",
            data,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          },
        ],
      });
    } catch (error) {
      return this.APIResponseMessages.errorOccurred(res, error as Error);
    }
  };

  numberOfShipmentsInThisYear = async (req: Request, res: Response) => {
    try {
      const now = new Date();
      const utcDayIndex = (now.getUTCDay() + 6) % 7; // Monday=0, Tuesday=1, ..., Sunday=6

      const startOfThisWeek = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate() - utcDayIndex,
          0,
          0,
          0,
        ),
      );
      const endOfThisWeek = new Date(startOfThisWeek);
      endOfThisWeek.setUTCDate(startOfThisWeek.getUTCDate() + 7);

      const results = await this.service.baseModel.aggregate([
        {
          $match: {
            user_id: (req as any).user?.id,
            is_sub_shipment: false,
            status: 3, // shipped
            pickup_time: {
              $gte: startOfThisWeek,
              $lt: endOfThisWeek,
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$pickup_time" },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
        {
          $project: {
            _id: 0,
            date: "$_id",
            count: 1,
          },
        },
      ]);

      const dayLabels = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];

      const countsByDate = results.reduce((acc: any, { date, count }: any) => {
        acc[date] = count;
        return acc;
      });

      const labels: string[] = [];
      const data: number[] = [];

      for (
        let d = new Date(startOfThisWeek);
        d < endOfThisWeek;
        d.setDate(d.getDate() + 1)
      ) {
        const iso = d.toISOString().slice(0, 10);
        labels.push(dayLabels[d.getDay() === 0 ? 6 : d.getDay() - 1]); // Sunday correction
        data.push(countsByDate[iso] || 0);
      }

      return this.APIResponseMessages.custom(res, {
        labels,
        datasets: [
          {
            label: "This week`s shipped shipments",
            data,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          },
        ],
      });
    } catch (error) {
      return this.APIResponseMessages.errorOccurred(res, error as Error);
    }
  };

  numberOfShipmentsInThisMonth = async (req: Request, res: Response) => {
    try {
      const now = new Date();
      const utcDayIndex = (now.getUTCDay() + 6) % 7; // Monday=0, Tuesday=1, ..., Sunday=6

      const startOfThisWeek = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate() - utcDayIndex,
          0,
          0,
          0,
        ),
      );
      const endOfThisWeek = new Date(startOfThisWeek);
      endOfThisWeek.setUTCDate(startOfThisWeek.getUTCDate() + 7);

      const results = await this.service.baseModel.aggregate([
        {
          $match: {
            user_id: (req as any).user?.id,
            is_sub_shipment: false,
            status: 3, // shipped
            pickup_time: {
              $gte: startOfThisWeek,
              $lt: endOfThisWeek,
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$pickup_time" },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
        {
          $project: {
            _id: 0,
            date: "$_id",
            count: 1,
          },
        },
      ]);

      const dayLabels = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];

      const countsByDate = results.reduce((acc: any, { date, count }: any) => {
        acc[date] = count;
        return acc;
      });

      const labels: string[] = [];
      const data: number[] = [];

      for (
        let d = new Date(startOfThisWeek);
        d < endOfThisWeek;
        d.setDate(d.getDate() + 1)
      ) {
        const iso = d.toISOString().slice(0, 10);
        labels.push(dayLabels[d.getDay() === 0 ? 6 : d.getDay() - 1]); // Sunday correction
        data.push(countsByDate[iso] || 0);
      }

      return this.APIResponseMessages.custom(res, {
        labels,
        datasets: [
          {
            label: "This week`s shipped shipments",
            data,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          },
        ],
      });
    } catch (error) {
      return this.APIResponseMessages.errorOccurred(res, error as Error);
    }
  };

  statusOfAllShipments = async (req: Request, res: Response) => {
    const results = await this.service.baseModel.aggregate([
      {
        $match: {
          user_id: new Types.ObjectId((req as any).user?.id),
          is_sub_shipment: false,
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const statusMap: Record<number, string> = {
      0: "Confirmed",
      1: "Ready to ship",
      2: "Arrived",
      3: "Shipped",
    };

    const countsByLabel = Object.fromEntries(
      Object.values(statusMap).map((label) => [label, 0]),
    );

    for (const { _id: StatusCode, count } of results) {
      const label = statusMap[StatusCode];
      if (label) countsByLabel[label] = count;
    }

    return this.APIResponseMessages.custom(res, {
      Confirmed: countsByLabel["Confirmed"],
      ReadyToShip: countsByLabel["Ready to ship"],
      Arrived: countsByLabel["Arrived"],
      Shipped: countsByLabel["Shipped"],
    });
  };

  numberOfShipments = (req: Request, res: Response) => {};

  uniqueFilteringData = (req: Request, res: Response) => {};
}

export default new ShipmentController();
