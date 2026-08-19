import { Hono } from "hono";

import {
  authMiddleware,
} from "../../middlewares/auth.middleware.js";

import {
  requireRole,
} from "../../middlewares/role.middleware.js";

import type {
  AppVariables,
} from "../../types.js";

import {
  createPositionSchema,
  positionQuerySchema,
  updatePositionSchema,
} from "./position.schema.js";

import {
  positionService,
} from "./position.service.js";

export const positionRoute =
  new Hono<{
    Variables: AppVariables;
  }>();

positionRoute.use(
  "*",
  authMiddleware,
);

positionRoute.use(
  "*",
  requireRole(
    "ADMIN",
    "RECRUITER",
  ),
);

positionRoute.post(
  "/",
  async (c) => {
    const body = await c.req.json();

    const parsed =
      createPositionSchema.safeParse(body);

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

    const currentUser =
      c.get("user");

    const position =
      await positionService.create(
        parsed.data,
        {
          id: currentUser.id,
          companyId:
            currentUser.companyId,
        },
      );

    return c.json(
      {
        success: true,
        message:
          "Position created successfully",
        data: {
          position,
        },
      },
      201,
    );
  },
);

positionRoute.get(
  "/",
  async (c) => {
    const parsed =
      positionQuerySchema.safeParse({
        page:
          c.req.query("page"),

        limit:
          c.req.query("limit"),

        sortBy:
          c.req.query("sortBy"),

        sortOrder:
          c.req.query("sortOrder"),
      });

    if (!parsed.success) {
      return c.json(
        {
          success: false,
          message:
            "Invalid query parameters",
          errors:
            parsed.error.flatten(),
        },
        400,
      );
    }

    const currentUser =
      c.get("user");

    const result =
      await positionService.findAll(
        currentUser.companyId,
        parsed.data,
      );

    return c.json({
      success: true,
      data: result,
    });
  },
);

positionRoute.get(
  "/:id",
  async (c) => {
    const id = c.req.param("id");

    const currentUser =
      c.get("user");

    const position =
      await positionService.findById(
        id,
        currentUser.companyId,
      );

    return c.json({
      success: true,
      data: {
        position,
      },
    });
  },
);

positionRoute.put(
  "/:id",
  async (c) => {
    const id = c.req.param("id");

    const body =
      await c.req.json();

    const parsed =
      updatePositionSchema.safeParse(body);

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

    const currentUser =
      c.get("user");

    const position =
      await positionService.update(
        id,
        currentUser.companyId,
        parsed.data,
      );

    return c.json({
      success: true,
      message:
        "Position updated successfully",
      data: {
        position,
      },
    });
  },
);

positionRoute.delete(
  "/:id",
  async (c) => {
    const id = c.req.param("id");

    const currentUser =
      c.get("user");

    await positionService.delete(
      id,
      currentUser.companyId,
    );

    return c.json({
      success: true,
      message:
        "Position deleted successfully",
    });
  },
);