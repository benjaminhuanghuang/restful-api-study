import { IDock } from "../interfaces/models";
import DockService from "../services/DockService";
import BaseController from "./baseController";
import { Request, Response } from "express";
import { Types } from "mongoose";
import XLSX from "xlsx";

class DockController extends BaseController {
  constructor() {
    super(DockService, "Dock", "name", true);
  }

  update = (req: Request, res: Response) => {
    const reqAny = req as any;
    const { name, _id } = req.body;
    try {
      this.service
        .findOne({
          user_id: reqAny.user.id,
          name: name,
          _id,
        })
        .then((existingDock: IDock) => {
          if (!existingDock)
            return this.APIResponseMessages.noRecordsFound(res);
          if (existingDock.name === name) {
            this.service
              .update(reqAny.user.id, existingDock._id.toString(), req.body)
              .then((updatedDock: IDock) => {
                return this.APIResponseMessages.updated(res, updatedDock);
              });
          } else {
            this.service
              .countDocuments(reqAny.user.id, { name })
              .then((count: number) => {
                if (count === 0) {
                  this.service
                    .update(
                      reqAny.user.id,
                      existingDock._id.toString(),
                      req.body,
                    )
                    .then((updatedDock: IDock) => {
                      return this.APIResponseMessages.updated(res, updatedDock);
                    });
                } else {
                  return this.APIResponseMessages.alreadyExists(
                    res,
                    `Dock with same name(${name}) already exists`,
                  );
                }
              });
          }
        });
    } catch (error) {
      return this.APIResponseMessages.errorOccurred(res, error as Error);
    }
  };

  numberOfDocks = async (req: Request, res: Response) => {
    const reqAny = req as any;
    try {
      const count = await this.service.countDocuments(reqAny.user.id, {
        deleted: false,
      });
      return this.APIResponseMessages.custom(res, { count });
    } catch (error) {
      return this.APIResponseMessages.errorOccurred(res, error as Error);
    }
  };

  uniqueDockFilterData = async (req: Request, res: Response) => {
    const reqAny = req as any;
    try {
      const list = await this.service.baseModel
        .aggregate([
          {
            $match: {
              user_id: new Types.ObjectId(reqAny.user.id),
              deleted: false,
            },
          },
          {
            $group: {
              _id: null,
              names: { $addToSet: "$name" },
              purposes: { $addToSet: "$purpose" },
              comments: { $addToSet: "$comment" },
              availabilities: { $addToSet: "$availability" },
              statuses: { $addToSet: "$status" },
            },
          },
          {
            $project: {
              _id: 0,
            },
          },
        ])
        .exec();
      const result = list[0] || {};
      if (result.statuses) {
        result.statuses = result.statuses.map((status: boolean) => ({
          key: status ? 1 : 0,
          value: status ? "Active" : "Inactive",
        }));
      }
      if (result.availabilities) {
        result.availabilities = result.availabilities.map(
          (availability: boolean) => ({
            key: availability ? 1 : 0,
            value: availability ? "Available" : "Unavailable",
          }),
        );
      }

      return this.APIResponseMessages.listed(res, result);
    } catch (error) {
      return this.APIResponseMessages.errorOccurred(res, error as Error);
    }
  };

  list = async (req: Request, res: Response) => {
    const reqAny = req as any;
    const filters: any = {
      user_id: new Types.ObjectId(reqAny.user.id),
      deleted: false,
    };

    if (req.query.id !== undefined) {
      let ids = req.query.id as string[];

      if (!Array.isArray(ids)) {
        filters._id = { $in: [new Types.ObjectId(ids)] };
      } else {
        filters._id = { $in: ids.map((id) => new Types.ObjectId(id)) };
      }
    }

    if (req.query.name !== undefined) {
      let names = req.query.name as string[];

      if (!Array.isArray(names)) {
        names = [names];
      }

      filters.name = { $in: names };
    }

    if (req.query.purpose !== undefined) {
      let purposes = req.query.purpose as string[];

      if (!Array.isArray(purposes)) {
        purposes = [purposes];
      }

      filters.purpose = { $in: purposes };
    }

    if (req.query.availability !== undefined) {
      const availabilityRaw = Array.isArray(req.query.availability)
        ? (req.query.availability as string[])
        : [req.query.availability as string];

      const availability = availabilityRaw
        .map((s) => {
          const str = String(s).trim();
          if (str === "1") return true;
          if (str === "0") return false;
          return null;
        })
        .filter((a) => a !== null);

      if (availability.length > 0) {
        filters.availability = { $in: availability };
      }
    }

    if (req.query.status !== undefined) {
      const statusRaw = Array.isArray(req.query.status)
        ? (req.query.status as string[])
        : [req.query.status as string];

      const status = statusRaw
        .map((s) => {
          const str = String(s).trim();
          if (str === "1") return true;
          if (str === "0") return false;
          return null;
        })
        .filter((s) => s !== null);

      if (status.length > 0) {
        filters.status = { $in: status };
      }
    }
    const pipeline: any[] = [{ $match: filters }];

    const countPipeline = [...pipeline, { $count: "totalCount" }];

    const countResult = await this.service.baseModel
      .aggregate(countPipeline)
      .exec();
    const totalCount = countResult[0] ? countResult[0].totalCount : 0;

    pipeline.push(
      { $sort: { createdAt: -1 } },
      { $skip: parseInt((req.query.skip as string) || "0") || 0 },
      { $limit: parseInt((req.query.limit as string) || "50") || 20 },
    );

    let list = await this.service.baseModel.aggregate(pipeline).exec();

    this.APIResponseMessages.custom(res, {
      message: "Docks listed successfully",
      data: list,
      length: totalCount,
      open_page:
        parseInt(req.query.skip as string) /
          parseInt(req.query.limit as string) +
        1,
    });
  };

  uploadDocks = async (req: Request, res: Response) => {
    const reqAny = req as any;
    try {
      if (!reqAny.files?.excel_file) {
        return this.APIResponseMessages.badRequest(
          res,
          "Excel file is required",
        );
      }

      const file = Array.isArray(reqAny.files.excel_file)
        ? reqAny.files.excel_file[0]
        : reqAny.files.excel_file;

      const wb = file.tempFilePath
        ? XLSX.readFile(file.tempFilePath)
        : XLSX.read(file.data, { type: "buffer" });

      const sheetName = wb.SheetNames[0];

      if (!sheetName) {
        return this.APIResponseMessages.badRequest(res, "Excel file is empty");
      }

      const sheet = wb.Sheets[sheetName];

      const rows = XLSX.utils.sheet_to_json<any>(sheet, { defval: "" });

      if (!rows.length) {
        return this.APIResponseMessages.badRequest(
          res,
          "Excel file contains no data",
        );
      }

      const docks = rows
        .map((row, index) => {
          const name = String(row["name"] || "").trim();

          if (!name) {
            throw new Error(`Name is required at row ${index + 2}`); // +2 to account for header and 0-based index
          }

          return {
            user_id: reqAny.user.id,
            name: name.slice(0, 128),
            purpose: row.purpose
              ? String(row["purpose"]).slice(0, 128)
              : undefined,
            comment: row.comment
              ? String(row["comment"]).slice(0, 512)
              : undefined,
            availability:
              row.availability === "Unavailable" ||
              row.availability === "0" ||
              row.availability === false
                ? false
                : true,
            status:
              row.status === "Inactive" || row.status === "0" ? false : true,
          };
        })
        .filter((dock) => !!dock.name);

      const inserted = [];
      for (const dock of docks) {
        if (!dock.name) continue;

        try {
          const doc = await this.service.baseModel.findOneAndUpdate(
            { user_id: dock.user_id, name: dock.name, deleted: false },
            dock,
            { upsert: true, new: true, setDefaultsOnInsert: true },
          );
          inserted.push(doc);
        } catch (error) {
          continue;
        }
      }

      this.APIResponseMessages.custom(res, {
        message: "Docks uploaded successfully",
        data: inserted,
        totalRows: rows.length,
        insertedRows: inserted.length,
      });
    } catch (error) {
      return this.APIResponseMessages.errorOccurred(res, error as Error);
    }
  };

  getDocks = async (req: Request, res: Response) => {
    const reqAny = req as any;
    try {
      const docks: IDock[] = await this.service.baseModel.find(
        { user_id: reqAny.user.id, deleted: false },
        "_id name",
      );
      return this.APIResponseMessages.listed(res, docks);
    } catch (error) {
      return this.APIResponseMessages.errorOccurred(res, error as Error);
    }
  };
}

export default new DockController();
