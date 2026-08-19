import { AppError } from "../../lib/app-error.js";
import { hashPassword } from "../../lib/password.js";

import { userRepository } from "./user.repository.js";

import type {
  CreateUserInput,
} from "./user.schema.js";

export const userService = {
  async create(
    input: CreateUserInput,
    companyId: string,
  ) {
    const existingUser =
      await userRepository.findByEmail(
        input.email,
      );

    if (existingUser) {
      throw new AppError(
        409,
        "Email already registered",
        "EMAIL_ALREADY_EXISTS",
      );
    }

    const passwordHash =
      await hashPassword(input.password);

    const user =
      await userRepository.create({
        companyId,
        email: input.email,
        fullName: input.fullName,
        passwordHash,
        role: "RECRUITER",
      });

    return {
      id: user.id,
      companyId: user.companyId,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      createdAt: user.createdAt,
    };
  },

  async findAll(companyId: string) {
    const users =
      await userRepository.findAllByCompany(
        companyId,
      );

    return users.map((user) => ({
      id: user.id,
      companyId: user.companyId,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  },

  async findById(
    id: string,
    companyId: string,
  ) {
    const user =
      await userRepository.findByIdAndCompany(
        id,
        companyId,
      );

    if (!user) {
      throw new AppError(
        404,
        "User not found",
        "USER_NOT_FOUND",
      );
    }

    return {
      id: user.id,
      companyId: user.companyId,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  },

  async delete(
    id: string,
    companyId: string,
  ) {
    const deletedUser =
      await userRepository.deleteByIdAndCompany(
        id,
        companyId,
      );

    if (!deletedUser) {
      throw new AppError(
        404,
        "User not found",
        "USER_NOT_FOUND",
      );
    }

    return deletedUser;
  },
};