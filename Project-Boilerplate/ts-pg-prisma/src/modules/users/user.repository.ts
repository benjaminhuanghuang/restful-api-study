import { prisma } from "../../db/client.ts";
import type { CreateUserInput, UpdateUserInput } from "./user.schema.ts";

export const userRepository = {
  list() {
    return prisma.user.findMany({ orderBy: { id: "desc" } });
  },

  getById(id: number) {
    return prisma.user.findUnique({ where: { id } });
  },

  create(input: CreateUserInput) {
    return prisma.user.create({ data: input });
  },

  async update(id: number, input: UpdateUserInput) {
    const exists = await prisma.user.findUnique({ where: { id } });
    if (!exists) return undefined;
    return prisma.user.update({ where: { id }, data: input });
  },

  async remove(id: number) {
    const exists = await prisma.user.findUnique({ where: { id } });
    if (!exists) return false;
    await prisma.user.delete({ where: { id } });
    return true;
  },
};
