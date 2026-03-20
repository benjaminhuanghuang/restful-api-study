import { ICustomer } from "../interfaces/models";
import CustomerService from "../services/CustomerService";
import BaseController from "./baseController";
import { Request, Response } from "express";
import { Types } from "mongoose";
import XLSX from "xlsx";

class CustomerController extends BaseController {
  constructor() {
    super(CustomerService, "Customer", "name", true);
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
        .then((existingCustomer: ICustomer) => {
          if (!existingCustomer)
            return this.APIResponseMessages.noRecordsFound(res);
          if (existingCustomer.name === name) {
            this.service
              .update(req.user.id, existingCustomer._id.toString(), req.body)
              .then((updatedCustomer: ICustomer) => {
                return this.APIResponseMessages.updated(res, updatedCustomer);
              });
          } else {
            this.service
              .countDocuments(req.user.id, { name })
              .then((count: number) => {
                if (count === 0) {
                  this.service
                    .update(
                      req.user.id,
                      existingCustomer._id.toString(),
                      req.body,
                    )
                    .then((updatedCustomer: ICustomer) => {
                      return this.APIResponseMessages.updated(
                        res,
                        updatedCustomer,
                      );
                    });
                } else {
                  return this.APIResponseMessages.alreadyExists(
                    res,
                    `Customer with same name(${name}) already exists`,
                  );
                }
              });
          }
        });
    } catch (error) {
      return this.APIResponseMessages.errorOccurred(res, error as Error);
    }
  };

  numberOfCustomers = async (req: Request, res: Response) => {
    try {
      const count = await this.service.countDocuments(req.user.id, {
        deleted: false,
      });
      return this.APIResponseMessages.custom(res, { count });
    } catch (error) {
      return this.APIResponseMessages.errorOccurred(res, error as Error);
    }
  };

  uniqueCustomerFilterData = async (req: Request, res: Response) => {
    try {
      const list = await this.service.baseModel
        .aggregate([
          {
            $match: {
              user_id: new Types.ObjectId(req.user.id),
              deleted: false,
            },
          },
          {
            $group: {
              _id: null,
              names: { $addToSet: "$name" },
              contact_persons: { $addToSet: "$contact_person" },
              contact_phones: { $addToSet: "$contact_phone" },
              contact_emails: { $addToSet: "$contact_email" },
              addresses_1: { $addToSet: "$address_1" },
              addresses_2: { $addToSet: "$address_2" },
              addresses_3: { $addToSet: "$address_3" },
              countries: { $addToSet: "$country" },
              comments: { $addToSet: "$comment" },
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

      return this.APIResponseMessages.listed(res, result);
    } catch (error) {
      return this.APIResponseMessages.errorOccurred(res, error as Error);
    }
  };

  list = async (req: Request, res: Response) => {
    const filters: object = {
      user_id: new Types.ObjectId(req.user.id),
      deleted: false,
    };

    if (req.query.id !== undefined) {
      let ids = req.query.id as string[];

      if (!Array.isArray(ids)) {
        ids = [new Types.ObjectId(ids)];
      } else {
        ids = ids.map((id) => new Types.ObjectId(id));
      }

      filters._id = { $in: ids };
    }

    if (req.query.name !== undefined) {
      let names = req.query.name as string[];

      if (!Array.isArray(names)) {
        names = [names];
      }

      filters.name = { $in: names };
    }

    if (req.query.contact_person !== undefined) {
      let contact_persons = req.query.contact_person as string[];

      if (!Array.isArray(contact_persons)) {
        contact_persons = [contact_persons];
      }

      filters.contact_person = { $in: contact_persons };
    }

    if (req.query.contact_phone !== undefined) {
      let contact_phones = req.query.contact_phone as string[];

      if (!Array.isArray(contact_phones)) {
        contact_phones = [contact_phones];
      }

      filters.contact_phone = { $in: contact_phones };
    }

    if (req.query.contact_email !== undefined) {
      let contact_emails = req.query.contact_email as string[];

      if (!Array.isArray(contact_emails)) {
        contact_emails = [contact_emails];
      }

      filters.contact_email = { $in: contact_emails };
    }

    if (req.query.address_1 !== undefined) {
      let addresses_1 = req.query.address_1 as string[];

      if (!Array.isArray(addresses_1)) {
        addresses_1 = [addresses_1];
      }

      filters.address_1 = { $in: addresses_1 };
    }

    if (req.query.address_2 !== undefined) {
      let addresses_2 = req.query.address_2 as string[];

      if (!Array.isArray(addresses_2)) {
        addresses_2 = [addresses_2];
      }

      filters.address_2 = { $in: addresses_2 };
    }

    if (req.query.address_3 !== undefined) {
      let addresses_3 = req.query.address_3 as string[];

      if (!Array.isArray(addresses_3)) {
        addresses_3 = [addresses_3];
      }

      filters.address_3 = { $in: addresses_3 };
    }

    if (req.query.country !== undefined) {
      let countries = req.query.country as string[];

      if (!Array.isArray(countries)) {
        countries = [countries];
      }

      filters.country = { $in: countries };
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
      message: "Carriers listed successfully",
      data: list,
      length: totalCount,
      open_page:
        parseInt(req.query.skip as string) /
          parseInt(req.query.limit as string) +
        1,
    });
  };

  uploadCustomers = async (req: Request, res: Response) => {
    try {
      if (!req.files.excel_file) {
        return this.APIResponseMessages.badRequest(
          res,
          "Excel file is required",
        );
      }

      const file = Array.isArray(req.files.excel_file)
        ? req.files.excel_file[0]
        : req.files.excel_file;

      const wb = file.tempFilePath
        ? XLSX.readFile(file.tempFilePath)
        : XLSX.read(file.data, { type: "buffer" });

      const sheetName = wb.SheetNames[0];

      if (!sheetName) {
        return this.APIResponseMessages.badRequest(res, "Excel file is empty");
      }

      const sheet = wb.Sheets[sheetName];

      const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      if (!rows.length) {
        return this.APIResponseMessages.badRequest(
          res,
          "Excel file contains no data",
        );
      }

      const customers = rows
        .map((row, index) => {
          const name = String(row["name"] || "").trim();

          if (!name) {
            throw new Error(`Name is required at row ${index + 2}`); // +2 to account for header and 0-based index
          }

          return {
            user_id: req.user.id,
            name: name.slice(0, 128),
            contact_person: row.contact_person
              ? String(row["contact_person"]).slice(0, 48)
              : undefined,
            contact_phone: row.contact_phone
              ? String(row["contact_phone"]).slice(0, 12)
              : undefined,
            contact_email: row.contact_email
              ? String(row["contact_email"]).slice(0, 128)
              : undefined,
            address_1: row.address_1
              ? String(row["address_1"]).slice(0, 128)
              : undefined,
            address_2: row.address_2
              ? String(row["address_2"]).slice(0, 128)
              : undefined,
            address_3: row.address_3
              ? String(row["address_3"]).slice(0, 128)
              : undefined,
            country: row.country
              ? String(row["country"]).slice(0, 128)
              : undefined,
            comment: row.comment
              ? String(row["comment"]).slice(0, 512)
              : undefined,
            status:
              row.status === "Inactive" || row.status === "0" ? false : true,
          };
        })
        .filter((customer) => !customer.error);

      const inserted = [];
      for (const customer of customers) {
        if (!customer.name) continue;

        try {
          const doc = await this.service.baseModel.findOneAndUpdate(
            { user_id: customer.user_id, name: customer.name, deleted: false },
            customer,
            { upsert: true, new: true, setDefaultsOnInsert: true },
          );
          inserted.push(doc);
        } catch (error) {
          continue;
        }
      }

      this.APIResponseMessages.custom(res, {
        message: "Carriers uploaded successfully",
        data: inserted,
        totalRows: rows.length,
        insertedRows: inserted.length,
      });
    } catch (error) {
      return this.APIResponseMessages.errorOccurred(res, error as Error);
    }
  };

  getCustomers = async (req: Request, res: Response) => {
    try {
      const customers: ICustomer[] = await this.service.baseModel.find(
        { user_id: req.user.id, deleted: false },
        "_id name",
      );
      return this.APIResponseMessages.listed(res, customers);
    } catch (error) {
      return this.APIResponseMessages.errorOccurred(res, error as Error);
    }
  };
}

export default new CustomerController();
