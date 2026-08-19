import { Hono } from "hono";

import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";

import type { AppVariables } from "../../types.js";

import {
  createUserSchema,
} from "./user.schema.js";

import {
  userService,
} from "./user.service.js";

export const userRoute = new Hono<{
  Variables: AppVariables;
}>();

userRoute.use("*", authMiddleware);

userRoute.use(
  "*",
  requireRole("ADMIN"),
);

userRoute.post("/", async (c) => {
  const body = await c.req.json();

  const parsed =
    createUserSchema.safeParse(body);

  if (!parsed.success) {
    return c.json(
      {
        success: false,
        message: "Invalid request",
        errors: parsed.error.flatten(),
      },
      400,
    );
  }

  const currentUser = c.get("user");

  const user = await userService.create(
    parsed.data,
    currentUser.companyId,
  );

  return c.json(
    {
      success: true,
      message: "User created successfully",
      data: {
        user,
      },
    },
    201,
  );
});

userRoute.get("/", async (c) => {
  const currentUser = c.get("user");

  const users = await userService.findAll(
    currentUser.companyId,
  );

  return c.json({
    success: true,
    data: {
      users,
    },
  });
});

userRoute.get("/:id", async (c) => {
  const id = c.req.param("id");

  const currentUser = c.get("user");

  const user = await userService.findById(
    id,
    currentUser.companyId,
  );

  return c.json({
    success: true,
    data: {
      user,
    },
  });
});

userRoute.delete("/:id", async (c) => {
  const id = c.req.param("id");

  const currentUser = c.get("user");

  if (id === currentUser.id) {
    return c.json(
      {
        success: false,
        message:
          "You cannot delete your own account",
      },
      400,
    );
  }

  await userService.delete(
    id,
    currentUser.companyId,
  );

  return c.json({
    success: true,
    message: "User deleted successfully",
  });
});