import { createMiddleware } from "hono/factory";

import type { AppVariables } from "../types.js";

type UserRole = "ADMIN" | "RECRUITER";

export function requireRole(...allowedRoles: UserRole[]) {
  return createMiddleware<{
    Variables: AppVariables;
  }>(async (c, next) => {
    const user = c.get("user");

    if (!allowedRoles.includes(user.role)) {
      return c.json(
        {
          success: false,
          message: "Forbidden",
        },
        403,
      );
    }

    await next();
  });
}