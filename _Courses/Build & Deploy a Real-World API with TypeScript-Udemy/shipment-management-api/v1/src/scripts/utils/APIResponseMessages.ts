import { Response } from "express";
import httpStatuses from "http-status";
import { Document } from "mongoose";

class APIResponseMessages {
  field: string;

  constructor(field: string) {
    this.field = field;
  }

  alreadyExists(res: Response, value: string) {
    res.status(httpStatuses.CONFLICT).send({
      success: false,
      message: `${this.field} ${value} already exists`,
    });
  }

  errorOccurred(res: Response, error: Error) {
    res.status(httpStatuses.INTERNAL_SERVER_ERROR).send({
      success: false,
      message: `Error occurred while processing ${error.message}`,
      error,
    });
  }

  noRecordsFound(res: Response) {
    res.status(httpStatuses.NOT_FOUND).send({
      success: false,
      message: `There is no ${this.field}`,
    });
  }

  created(res: Response, created: Document | object) {
    if (created instanceof Document) {
      created = created.toJSON();
    }

    res.status(httpStatuses.CREATED).send({
      success: true,
      message: `${this.field} created successfully.`,
      data: created,
    });
  }

  updated(res: Response, updated: Document) {
    return res.status(httpStatuses.OK).send({
      success: true,
      message: `${this.field} updated successfully`,
      data: updated,
    });
  }

  deleted(res: Response, deleted: Document) {
    return res.status(httpStatuses.OK).send({
      success: true,
      message: `${this.field} deleted successfully`,
      data: deleted,
    });
  }

  listed(res: Response, listed: Document[]) {
    return res.status(httpStatuses.OK).send({
      success: true,
      message: `${this.field} listed successfully`,
      data: listed,
    });
  }

  badRequest(res: Response, message: string) {
    return res.status(httpStatuses.BAD_REQUEST).send({
      success: false,
      message,
    });
  }

  exceeded(res: Response, message: string) {
    return res.status(httpStatuses.FORBIDDEN).send({
      success: false,
      message,
    });
  }

  custom(res: Response, data: string | object | Document) {
    return res.status(httpStatuses.OK).send({
      success: true,
      data,
    });
  }
}

export default APIResponseMessages;
