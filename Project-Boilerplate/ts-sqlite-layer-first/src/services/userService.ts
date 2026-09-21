import { AppError } from "../utils/AppError.ts";
import { userRepository } from "../repositories/userRepository.ts";
import type { CreateUserInput, UpdateUserInput } from "../validators/user.validator.ts";

export const userService = {
  list() {
    return userRepository.list();
  },

  getById(id: number) {
    const user = userRepository.getById(id);
    if (!user) throw AppError.notFound("User not found");
    return user;
  },

  create(input: CreateUserInput) {
    return userRepository.create(input);
  },

  update(id: number, input: UpdateUserInput) {
    const user = userRepository.update(id, input);
    if (!user) throw AppError.notFound("User not found");
    return user;
  },

  remove(id: number) {
    const removed = userRepository.remove(id);
    if (!removed) throw AppError.notFound("User not found");
  },
};
