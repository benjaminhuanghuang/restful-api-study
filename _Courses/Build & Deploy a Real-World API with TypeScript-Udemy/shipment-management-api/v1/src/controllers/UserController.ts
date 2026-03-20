import BaseController from "./baseController";
import { UserService } from "../services";
import { Request, Response } from "express";
import { IUser } from "../interfaces/models";
import httpStatus from "http-status";
import {
  generateAccessToken,
  generateRefreshToken,
  passwordToHash,
} from "../scripts/utils/helper";
import { isDev } from "../config/env";
import eventEmitter from "../scripts/events/eventEmitter";

class UserController extends BaseController {
  constructor() {
    super(UserService, "User");
  }

  create = (req: Request, res: Response) => {
    const { email } = req.body;

    this.service
      .findOne({ email })
      .then((existingUser: IUser) => {
        if (!existingUser) {
          req.body.password = passwordToHash(req.body.password);
          this.service
            .create(req.body)
            .then((response: IUser) => {
              this.APIResponseMessages.created(res, response);
            })
            .catch((error: Error) => {
              this.APIResponseMessages.errorOccurred(res, error);
            });
        }
      })
      .catch((error: Error) => {
        this.APIResponseMessages.errorOccurred(res, error);
      });
  };

  login = (req: Request, res: Response) => {
    req.body.password = passwordToHash(req.body.password);
    this.service
      .findOne(req.body)
      .then((user: IUser) => {
        if (!user) {
          return res
            .status(httpStatus.NOT_FOUND)
            .send({ message: "User not found" });
        }

        const result = {
          ...user.toObject(),
          tokens: {
            accessToken: generateAccessToken({
              email: user.email,
              _id: user._id,
            }),
            refreshToken: generateRefreshToken({
              email: user.email,
              _id: user._id,
            }),
          },
        };
        res.status(httpStatus.OK).send(result);
      })
      .catch((error: Error) => {
        this.APIResponseMessages.errorOccurred(res, error);
      });
  };

  forgotPassword = (req: Request, res: Response) => {
    this.service
      .findOne({ email: req.body.email })
      .then((user: IUser) => {
        if (!user) {
          return res
            .status(httpStatus.NOT_FOUND)
            .send({ message: "User not found" });
        }
        const accessToken = generateAccessToken(
          { email: user.email, id: user._id },
          "15m",
        );
        const timestamp = Date.now();
        const baseUrl = isDev ? `http://localhost:3000` : `https://kluxin.com`;
        eventEmitter.emit("send_email", {
          to: user.email,
          subject: "Password Reset Request",
          html: `
                <p>You requested a password reset. Click the link below to reset your password:</p>
                <a href="${baseUrl}/reset-password?token=${accessToken}&ts=${timestamp}">Reset Password</a>
                <p>This link will expire in 15 minutes.</p>
            `,
        });
        return res
          .status(httpStatus.OK)
          .send({ message: "Password reset email sent successfully" });
      })
      .catch((error: Error) => {
        return this.APIResponseMessages.errorOccurred(res, error);
      });
  };

  changePassword = (req: Request, res: Response) => {
    req.body.password = passwordToHash(req.body.password);

    this.service.baseModel
      .findByIdAndUpdate(req.user.id, req.body)
      .then((updatedUser: IUser) => {
        if (updatedUser) {
          return res
            .status(httpStatus.OK)
            .send({ message: "Password changed successfully" });
        } else {
          return res
            .status(httpStatus.NOT_FOUND)
            .send({ message: "User not found" });
        }
      })
      .catch((error: Error) => {
        this.APIResponseMessages.errorOccurred(res, error);
      });
  };

  getProfile = (req: Request, res: Response) => {
    this.service
      .findOne({ _id: req.user.id })
      .then((user: IUser) => {
        if (user) {
          return this.APIResponseMessages.custom(res, user);
        } else {
          return this.APIResponseMessages.noRecordsFound(res);
        }
      })
      .catch((error: Error) => {
        return this.APIResponseMessages.errorOccurred(res, error);
      });
  };

  updateBillingInformation = (req: Request, res: Response) => {
    const modifiedBody = Object.keys(req.body).reduce(
      (acc: any, key: string) => {
        acc[`billing_information.${key}`] = req.body[key];
        return acc;
      },
      {},
    );

    this.service.baseModel
      .findByIdAndUpdate(req.user.id, modifiedBody)
      .then((updatedUser: IUser) => {
        if (updatedUser) {
          return this.APIResponseMessages.updated(
            res,
            updatedUser.billing_information as any,
          );
        } else {
          return this.APIResponseMessages.noRecordsFound(res);
        }
      })
      .catch((error: Error) => {
        return this.APIResponseMessages.errorOccurred(res, error);
      });
  };

  getBillingAddress = (req: Request, res: Response) => {
    this.service.baseModel
      .findOne({ _id: req.user.id })
      .select({
        "billing_information.company_name": 1,
        "billing_information.registration_tax_id": 1,
        "billing_information.vat_number": 1,
        "billing_information.billing_email": 1,
        "billing_information.contact_name": 1,
        "billing_information.phone_number": 1,
        "billing_information.billing_address": 1,
        "billing_information.city": 1,
        "billing_information.state_province": 1,
        "billing_information.country": 1,
        "billing_information.postcode": 1,
        _id: 0,
      })
      .then((user: IUser) => {
        if (user) {
          return this.APIResponseMessages.custom(res, user);
        } else {
          return this.APIResponseMessages.noRecordsFound(res);
        }
      })
      .catch((error: Error) => {
        return this.APIResponseMessages.errorOccurred(res, error);
      });
  };

  uploadCompanyLogo = (req: Request, res: Response) => {};
}

export default new UserController();
