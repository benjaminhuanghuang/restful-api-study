import { AppError } from "../../utils/AppError.ts";
import { userRepository } from "./user.repository.ts";
import type { CreateUserInput, UpdateUserInput } from "./user.schema.ts";

export const userService = {
  list() {
    return userRepository.list();
  },

  async getById(id: number) {
    const user = await userRepository.getById(id);
    if (!user) throw AppError.notFound("User not found");
    return user;
  },

  create(input: CreateUserInput) {
    return userRepository.create(input);
  },

  async update(id: number, input: UpdateUserInput) {
    const user = await userRepository.update(id, input);
    if (!user) throw AppError.notFound("User not found");
    return user;
  },

  async remove(id: number) {
    const removed = await userRepository.remove(id);
    if (!removed) throw AppError.notFound("User not found");
  },
};
