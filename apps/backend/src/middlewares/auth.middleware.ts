import { createMiddleware } from "hono/factory";
import { getCookie } from "hono/cookie";

import {
  AUTH_COOKIE_NAME,
} from "../lib/auth-cookie.js";

import {
  verifyAccessToken,
} from "../lib/jwt.js";

import {
  authRepository,
} from "../features/auth/auth.repository.js";

import type {
  AppVariables,
} from "../types.js";

export const authMiddleware =
  createMiddleware<{
    Variables: AppVariables;
  }>(async (c, next) => {
    const authorization =
      c.req.header("Authorization");

    const bearerToken =
      authorization?.startsWith("Bearer ")
        ? authorization.slice(7).trim()
        : undefined;

    const cookieToken =
      getCookie(
        c,
        AUTH_COOKIE_NAME,
      );

    const token =
      bearerToken ||
      cookieToken;

    if (!token) {
      return c.json(
        {
          success: false,
          message: "Unauthorized",
        },
        401,
      );
    }

    try {
      const payload =
        await verifyAccessToken(
          token,
        );

      const userId =
        payload.sub as string;

      const user =
        await authRepository
          .findUserById(
            userId,
          );

      if (!user) {
        return c.json(
          {
            success: false,
            message: "Unauthorized",
          },
          401,
        );
      }

      c.set("user", {
        id: user.id,
        companyId: user.companyId,
        companyName: user.companyName,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      });

      await next();
    } catch {
      return c.json(
        {
          success: false,
          message: "Unauthorized",
        },
        401,
      );
    }
  });
