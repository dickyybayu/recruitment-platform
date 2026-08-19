import { Hono } from "hono";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { authRepository } from "../features/auth/auth.repository.js";
import { verifyAccessToken } from "../lib/jwt.js";
import { authMiddleware } from "./auth.middleware.js";

vi.mock("../features/auth/auth.repository.js", () => ({
  authRepository: {
    findUserById: vi.fn(),
  },
}));

vi.mock("../lib/jwt.js", () => ({
  verifyAccessToken: vi.fn(),
}));

describe("authMiddleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sets current user with companyName from the user's company", async () => {
    vi.mocked(verifyAccessToken).mockResolvedValue({
      sub: "user-1",
    });

    vi.mocked(authRepository.findUserById).mockResolvedValue({
      id: "user-1",
      companyId: "company-1",
      companyName: "PT Maju Jaya",
      email: "admin@example.com",
      fullName: "Admin User",
      role: "ADMIN",
    });

    const app = new Hono();

    app.use("*", authMiddleware);
    app.get("/api/auth/me", (c) =>
      c.json({
        success: true,
        data: {
          user: c.get("user"),
        },
      }),
    );

    const response = await app.request("/api/auth/me", {
      headers: {
        Authorization: "Bearer token",
      },
    });

    await expect(response.json()).resolves.toEqual({
      success: true,
      data: {
        user: {
          id: "user-1",
          companyId: "company-1",
          companyName: "PT Maju Jaya",
          email: "admin@example.com",
          fullName: "Admin User",
          role: "ADMIN",
        },
      },
    });

    expect(authRepository.findUserById).toHaveBeenCalledWith("user-1");
  });
});
