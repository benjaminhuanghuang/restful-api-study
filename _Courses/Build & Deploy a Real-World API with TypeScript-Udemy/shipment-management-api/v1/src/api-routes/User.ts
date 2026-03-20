import validate from "../middlewares/validate";
import validationSchemas from "../validations/User";
import express from "express";
import authenticate from "../middlewares/authenticate";
import User from "../controllers/UserController";

const router = express.Router();

router.route("/").post(validate(validationSchemas.create), User.create);
router.route("/login").post(validate(validationSchemas.login), User.login);
router
  .route("/change-password")
  .post(
    authenticate,
    validate(validationSchemas.changePassword),
    User.changePassword,
  );

export default router;
