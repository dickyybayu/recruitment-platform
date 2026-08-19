import { Hono } from "hono";

import {
  clearAuthCookie,
  setAuthCookie,
} from "../../lib/auth-cookie.js";

import { authMiddleware } from "../../middlewares/auth.middleware.js";

import {
  loginSchema,
  registerSchema,
} from "./auth.schema.js";

import { authService } from "./auth.service.js";

export const authRoute = new Hono();

authRoute.post("/register", async (c) => {
  const body = await c.req.json();

  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return c.json(
      {
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten(),
      },
      400,
    );
  }

  const result = await authService.register(
    parsed.data,
  );

  setAuthCookie(c, result.token);

  return c.json(
    {
      token: result.token,
      user: result.user,
    },
    201,
  );
});

authRoute.post("/login", async (c) => {
  const body = await c.req.json();

  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return c.json(
      {
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten(),
      },
      400,
    );
  }

  const result = await authService.login(
    parsed.data,
  );

  setAuthCookie(c, result.token);

  return c.json({
    token: result.token,
    user: result.user,
  });
});

authRoute.post("/logout", (c) => {
  clearAuthCookie(c);

  return c.json({
    success: true,
    message: "Logout successful",
  });
});

authRoute.get(
  "/me",
  authMiddleware,
  (c) => {
    const user = c.get("user");

    return c.json({
      success: true,
      data: {
        user,
      },
    });
  },
);