import BaseController from "./BaseController";
import { UserService } from "../services";
import { Request, Response } from "express";
import { IUser } from "../interfaces/models";
import httpStatus from "http-status";
import {
  generateAccessToken,
  generateRefreshToken,
  passwordToHash,
} from "../scripts/utils/helper";

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

  forgotPassword = (req: Request, res: Response) => {};

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

  getProfile = (req: Request, res: Response) => {};

  getBillingAddress = (req: Request, res: Response) => {};

  uploadCompanyLogo = (req: Request, res: Response) => {};
}

export default new UserController();
