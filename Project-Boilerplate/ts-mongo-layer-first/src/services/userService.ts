import { AppError } from "../utils/AppError.ts";
import { User } from "../models/User.ts";
import type { CreateUserInput, UpdateUserInput } from "../validators/user.validator.ts";

export const userService = {
  list() {
    return User.find().sort({ createdAt: -1 });
  },

  async getById(id: string) {
    const user = await User.findById(id);
    if (!user) throw AppError.notFound("User not found");
    return user;
  },

  create(input: CreateUserInput) {
    return User.create(input);
  },

  async update(id: string, input: UpdateUserInput) {
    const user = await User.findByIdAndUpdate(id, input, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!user) throw AppError.notFound("User not found");
    return user;
  },

  async remove(id: string) {
    const user = await User.findByIdAndDelete(id);
    if (!user) throw AppError.notFound("User not found");
  },
};
