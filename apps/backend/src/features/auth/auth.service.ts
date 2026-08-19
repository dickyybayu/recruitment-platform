import {
  hashPassword,
  verifyPassword,
} from "../../lib/password.js";

import {
  createAccessToken,
} from "../../lib/jwt.js";

import { AppError } from "../../lib/app-error.js";

import { authRepository } from "./auth.repository.js";

import type {
  LoginInput,
  RegisterInput,
} from "./auth.schema.js";

export const authService = {
  async register(input: RegisterInput) {
    const existingUser =
      await authRepository.findUserByEmail(
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
      await hashPassword(
        input.password,
      );

    const result =
      await authRepository.createCompanyWithAdmin({
        company: {
          name: input.companyName,
          email: input.email,
          phone: input.phone,
          address: "",
        },

        user: {
          email: input.email,
          passwordHash,
          fullName: input.fullName,
        },
      });

    const token =
      await createAccessToken(
        result.user.id,
      );

    return {
      token,

      user: {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role,
        companyId: result.user.companyId,
      },
    };
  },

  async login(input: LoginInput) {
    const user =
      await authRepository.findUserByEmail(
        input.email,
      );

    if (!user) {
      throw new AppError(
        401,
        "Invalid email or password",
        "INVALID_CREDENTIALS",
      );
    }

    const validPassword =
      await verifyPassword(
        input.password,
        user.passwordHash,
      );

    if (!validPassword) {
      throw new AppError(
        401,
        "Invalid email or password",
        "INVALID_CREDENTIALS",
      );
    }

    const token =
      await createAccessToken(
        user.id,
      );

    return {
      token,

      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
      },
    };
  },
};