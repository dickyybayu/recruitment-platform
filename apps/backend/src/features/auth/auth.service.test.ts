import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  authRepository,
} from "./auth.repository.js";

import {
  authService,
} from "./auth.service.js";

import {
  hashPassword,
  verifyPassword,
} from "../../lib/password.js";

import {
  createAccessToken,
} from "../../lib/jwt.js";

vi.mock("./auth.repository.js", () => ({
  authRepository: {
    findUserByEmail: vi.fn(),
    findUserById: vi.fn(),
    createCompanyWithAdmin: vi.fn(),
  },
}));

vi.mock("../../lib/password.js", () => ({
  hashPassword: vi.fn(),
  verifyPassword: vi.fn(),
}));

vi.mock("../../lib/jwt.js", () => ({
  createAccessToken: vi.fn(),
}));

describe("authService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects login when user does not exist", async () => {
    vi.mocked(
      authRepository.findUserByEmail,
    ).mockResolvedValue(undefined);

    await expect(
      authService.login({
        email: "missing@example.com",
        password: "Password123!",
      }),
    ).rejects.toMatchObject({
      statusCode: 401,
      code: "INVALID_CREDENTIALS",
      message: "Invalid email or password",
    });
  });

  it("rejects login when password is incorrect", async () => {
    vi.mocked(
      authRepository.findUserByEmail,
    ).mockResolvedValue({
      id: "user-1",
      companyId: "company-1",
      email: "admin@example.com",
      passwordHash: "hashed-password",
      fullName: "Admin",
      role: "ADMIN",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.mocked(
      verifyPassword,
    ).mockResolvedValue(false);

    await expect(
      authService.login({
        email: "admin@example.com",
        password: "wrong-password",
      }),
    ).rejects.toMatchObject({
      statusCode: 401,
      code: "INVALID_CREDENTIALS",
      message: "Invalid email or password",
    });

    expect(
      verifyPassword,
    ).toHaveBeenCalledWith(
      "wrong-password",
      "hashed-password",
    );

    expect(
      createAccessToken,
    ).not.toHaveBeenCalled();
  });

  it("returns token and user when login succeeds", async () => {
    vi.mocked(
      authRepository.findUserByEmail,
    ).mockResolvedValue({
      id: "user-1",
      companyId: "company-1",
      email: "admin@example.com",
      passwordHash: "hashed-password",
      fullName: "Admin",
      role: "ADMIN",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.mocked(
      verifyPassword,
    ).mockResolvedValue(true);

    vi.mocked(
      createAccessToken,
    ).mockResolvedValue(
      "mock-token",
    );

    const result =
      await authService.login({
        email: "admin@example.com",
        password: "Password123!",
      });

    expect(
      authRepository.findUserByEmail,
    ).toHaveBeenCalledWith(
      "admin@example.com",
    );

    expect(
      verifyPassword,
    ).toHaveBeenCalledWith(
      "Password123!",
      "hashed-password",
    );

    expect(
      createAccessToken,
    ).toHaveBeenCalledWith(
      "user-1",
    );

    expect(result).toEqual({
      token: "mock-token",

      user: {
        id: "user-1",
        email: "admin@example.com",
        role: "ADMIN",
        companyId: "company-1",
      },
    });
  });

  it("rejects registration when email already exists", async () => {
    vi.mocked(
      authRepository.findUserByEmail,
    ).mockResolvedValue({
      id: "existing-user",
      companyId: "company-1",
      email: "admin@example.com",
      passwordHash: "hash",
      fullName: "Admin",
      role: "ADMIN",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(
      authService.register({
        companyName: "PT Test",
        email: "admin@example.com",
        password: "Password123!",
        fullName: "Admin",
        phone: "08123456789",
      }),
    ).rejects.toMatchObject({
      statusCode: 409,
      code: "EMAIL_ALREADY_EXISTS",
      message: "Email already registered",
    });

    expect(
      hashPassword,
    ).not.toHaveBeenCalled();

    expect(
      authRepository
        .createCompanyWithAdmin,
    ).not.toHaveBeenCalled();
  });

  it("hashes password and creates company admin on register", async () => {
    vi.mocked(
      authRepository.findUserByEmail,
    ).mockResolvedValue(undefined);

    vi.mocked(
      hashPassword,
    ).mockResolvedValue(
      "hashed-password",
    );

    vi.mocked(
      authRepository
        .createCompanyWithAdmin,
    ).mockResolvedValue({
      company: {
        id: "company-1",
        name: "PT Test",
        email: "admin@example.com",
        phone: "08123456789",
        address: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      user: {
        id: "user-1",
        companyId: "company-1",
        email: "admin@example.com",
        passwordHash: "hashed-password",
        fullName: "Admin",
        role: "ADMIN",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    vi.mocked(
      createAccessToken,
    ).mockResolvedValue(
      "mock-token",
    );

    const result =
      await authService.register({
        companyName: "PT Test",
        email: "admin@example.com",
        password: "Password123!",
        fullName: "Admin",
        phone: "08123456789",
      });

    expect(
      authRepository.findUserByEmail,
    ).toHaveBeenCalledWith(
      "admin@example.com",
    );

    expect(
      hashPassword,
    ).toHaveBeenCalledWith(
      "Password123!",
    );

    expect(
      authRepository
        .createCompanyWithAdmin,
    ).toHaveBeenCalledWith({
      company: {
        name: "PT Test",
        email: "admin@example.com",
        phone: "08123456789",
        address: "",
      },

      user: {
        email: "admin@example.com",
        passwordHash: "hashed-password",
        fullName: "Admin",
      },
    });

    expect(
      createAccessToken,
    ).toHaveBeenCalledWith(
      "user-1",
    );

    expect(result).toEqual({
      token: "mock-token",

      user: {
        id: "user-1",
        email: "admin@example.com",
        role: "ADMIN",
        companyId: "company-1",
      },
    });
  });
});