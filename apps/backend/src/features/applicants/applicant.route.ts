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
  applicantQuerySchema,
  createApplicantSchema,
  updateApplicantNotesSchema,
  updateApplicantStatusSchema,
} from "./applicant.schema.js";

import {
  applicantService,
} from "./applicant.service.js";

export const applicantRoute =
  new Hono<{
    Variables: AppVariables;
  }>();

applicantRoute.post(
  "/",
  async (c) => {
    const body =
      await c.req.json();

    const parsed =
      createApplicantSchema
        .safeParse(body);

    if (!parsed.success) {
      return c.json(
        {
          success: false,
          message:
            "Invalid request",
          errors:
            parsed.error.flatten(),
        },
        400,
      );
    }

    const applicant =
      await applicantService.create(
        parsed.data,
      );

    return c.json(
      {
        success: true,
        message:
          "Application submitted successfully",
        data: {
          applicant,
        },
      },
      201,
    );
  },
);

applicantRoute.get(
  "/",
  authMiddleware,
  requireRole(
    "ADMIN",
    "RECRUITER",
  ),
  async (c) => {
    const parsed =
      applicantQuerySchema
        .safeParse({
          positionId:
            c.req.query("positionId"),

          status:
            c.req.query("status"),

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

    const applicants =
      await applicantService.findAll(
        currentUser.companyId,
        parsed.data,
      );

    return c.json({
      success: true,
      data: {
        applicants,
      },
    });
  },
);

applicantRoute.get(
  "/:id",
  authMiddleware,
  requireRole(
    "ADMIN",
    "RECRUITER",
  ),
  async (c) => {
    const id =
      c.req.param("id");

    const currentUser =
      c.get("user");

    const applicant =
      await applicantService.findById(
        id,
        currentUser.companyId,
      );

    return c.json({
      success: true,
      data: {
        applicant,
      },
    });
  },
);

applicantRoute.patch(
  "/:id/status",
  authMiddleware,
  requireRole(
    "ADMIN",
    "RECRUITER",
  ),
  async (c) => {
    const id =
      c.req.param("id");

    const parsed =
      updateApplicantStatusSchema
        .safeParse(
          await c.req.json(),
        );

    if (!parsed.success) {
      return c.json(
        {
          success: false,
          message:
            "Invalid request",
          errors:
            parsed.error.flatten(),
        },
        400,
      );
    }

    const currentUser =
      c.get("user");

    const applicant =
      await applicantService
        .updateStatus(
          id,
          currentUser.companyId,
          parsed.data.status,
        );

    return c.json({
      success: true,
      message:
        "Applicant status updated successfully",
      data: {
        applicant,
      },
    });
  },
);

applicantRoute.patch(
  "/:id/notes",
  authMiddleware,
  requireRole(
    "ADMIN",
    "RECRUITER",
  ),
  async (c) => {
    const id =
      c.req.param("id");

    const parsed =
      updateApplicantNotesSchema
        .safeParse(
          await c.req.json(),
        );

    if (!parsed.success) {
      return c.json(
        {
          success: false,
          message:
            "Invalid request",
          errors:
            parsed.error.flatten(),
        },
        400,
      );
    }

    const currentUser =
      c.get("user");

    const applicant =
      await applicantService
        .updateNotes(
          id,
          currentUser.companyId,
          parsed.data.notes,
        );

    return c.json({
      success: true,
      message:
        "Applicant notes updated successfully",
      data: {
        applicant,
      },
    });
  },
);

applicantRoute.delete(
  "/:id",
  authMiddleware,
  requireRole(
    "ADMIN",
    "RECRUITER",
  ),
  async (c) => {
    const id =
      c.req.param("id");

    const currentUser =
      c.get("user");

    await applicantService.delete(
      id,
      currentUser.companyId,
    );

    return c.json({
      success: true,
      message:
        "Applicant deleted successfully",
    });
  },
);