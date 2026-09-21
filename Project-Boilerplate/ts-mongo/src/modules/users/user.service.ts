import { AppError } from "../../utils/AppError.ts";
import { UserModel } from "./user.model.ts";
import type { CreateUserInput, UpdateUserInput } from "./user.schema.ts";

export const userService = {
  list() {
    return UserModel.find().sort({ createdAt: -1 });
  },

  async getById(id: string) {
    const user = await UserModel.findById(id);
    if (!user) throw AppError.notFound("User not found");
    return user;
  },

  create(input: CreateUserInput) {
    return UserModel.create(input);
  },

  async update(id: string, input: UpdateUserInput) {
    const user = await UserModel.findByIdAndUpdate(id, input, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!user) throw AppError.notFound("User not found");
    return user;
  },

  async remove(id: string) {
    const user = await UserModel.findByIdAndDelete(id);
    if (!user) throw AppError.notFound("User not found");
  },
};
