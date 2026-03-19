import BaseController from "./BaseController";
import { UserService } from "../services";
import { Request, Response } from "express";
import { IUser } from "../interfaces/models";
import { passwordToHash } from "../scripts/utils/helper";


class UserController extends BaseController {
  constructor() {
    super(UserService, "User");
  }

  create = (req: Request, res: Response) => {
    const { email } = req.body;

    this.service.findOne({ email }).then((existingUser: IUser) => {
        if (!existingUser) {
            req.body.password = passwordToHash(req.body.password);
            this.service.create(req.body).then((response: IUser) => {
                this.APIResponseMessages.created(res, response)
            }).catch((error: Error) => {
                this.APIResponseMessages.errorOccurred(res, error)
            })
        }
    }).catch((error: Error) => {
        this.APIResponseMessages.errorOccurred(res, error)
    }
}
}

export default UserController;
