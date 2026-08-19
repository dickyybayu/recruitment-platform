import { Hono } from "hono";

import {
  publicPositionService,
} from "./public-position.service.js";

import {
  publicPositionQuerySchema,
} from "./public-position.schema.js";

export const publicPositionRoute =
  new Hono();

publicPositionRoute.get(
  "/",
  async (c) => {
    const parsed =
      publicPositionQuerySchema
        .safeParse({
          search:
            c.req.query("search"),

          location:
            c.req.query("location"),

          type:
            c.req.query("type"),
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

    const positions =
      await publicPositionService
        .findAll(parsed.data);

    return c.json({
      success: true,
      data: {
        positions,
      },
    });
  },
);

publicPositionRoute.get(
  "/:id",
  async (c) => {
    const id =
      c.req.param("id");

    const position =
      await publicPositionService
        .findById(id);

    return c.json({
      success: true,
      data: {
        position,
      },
    });
  },
);