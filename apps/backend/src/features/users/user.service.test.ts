import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { userRepository } from "./user.repository.js";
import { userService } from "./user.service.js";
import { createUserSchema } from "./user.schema.js";

import { hashPassword } from "../../lib/password.js";

vi.mock("./user.repository.js", () => ({
  userRepository: {
    findByEmail: vi.fn(),
    findAllByCompany: vi.fn(),
    findByIdAndCompany: vi.fn(),
    create: vi.fn(),
    deleteByIdAndCompany: vi.fn(),
  },
}));

vi.mock("../../lib/password.js", () => ({
  hashPassword: vi.fn(),
}));

describe("userService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects create when email already exists", async () => {
    vi.mocked(
      userRepository.findByEmail,
    ).mockResolvedValue({
      id: "user-existing",
      companyId: "company-a",
      email: "recruiter@example.com",
      passwordHash: "hash",
      fullName: "Recruiter",
      role: "RECRUITER",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(
      userService.create(
        {
          email: "recruiter@example.com",
          fullName: "Recruiter",
          password: "Password123!",
          role: "RECRUITER",
        },
        "company-a",
      ),
    ).rejects.toMatchObject({
      statusCode: 409,
      code: "EMAIL_ALREADY_EXISTS",
      message: "Email already registered",
    });

    expect(
      hashPassword,
    ).not.toHaveBeenCalled();

    expect(
      userRepository.create,
    ).not.toHaveBeenCalled();
  });

  it("creates recruiter using authenticated companyId", async () => {
    vi.mocked(
      userRepository.findByEmail,
    ).mockResolvedValue(undefined);

    vi.mocked(
      hashPassword,
    ).mockResolvedValue(
      "hashed-password",
    );

    vi.mocked(
      userRepository.create,
    ).mockResolvedValue({
      id: "user-2",
      companyId: "company-a",
      email: "recruiter@example.com",
      passwordHash: "hashed-password",
      fullName: "Recruiter",
      role: "RECRUITER",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result =
      await userService.create(
        {
          email: "recruiter@example.com",
          fullName: "Recruiter",
          password: "Password123!",
          role: "RECRUITER",
        },
        "company-a",
      );

    expect(
      userRepository.findByEmail,
    ).toHaveBeenCalledWith(
      "recruiter@example.com",
    );

    expect(
      hashPassword,
    ).toHaveBeenCalledWith(
      "Password123!",
    );

    expect(
      userRepository.create,
    ).toHaveBeenCalledWith({
      companyId: "company-a",
      email: "recruiter@example.com",
      fullName: "Recruiter",
      passwordHash: "hashed-password",
      role: "RECRUITER",
    });

    expect(result).toMatchObject({
      id: "user-2",
      companyId: "company-a",
      email: "recruiter@example.com",
      fullName: "Recruiter",
      role: "RECRUITER",
    });
  });

  it("finds all users using tenant companyId", async () => {
    vi.mocked(
      userRepository.findAllByCompany,
    ).mockResolvedValue([]);

    const result =
      await userService.findAll(
        "company-a",
      );

    expect(
      userRepository.findAllByCompany,
    ).toHaveBeenCalledWith(
      "company-a",
    );

    expect(result).toEqual([]);
  });

  it("throws when user is not found in company", async () => {
    vi.mocked(
      userRepository.findByIdAndCompany,
    ).mockResolvedValue(undefined);

    await expect(
      userService.findById(
        "user-b",
        "company-a",
      ),
    ).rejects.toMatchObject({
      statusCode: 404,
      code: "USER_NOT_FOUND",
      message: "User not found",
    });
  });

  it("uses both id and companyId when finding user", async () => {
    vi.mocked(
      userRepository.findByIdAndCompany,
    ).mockResolvedValue({
      id: "user-a",
      companyId: "company-a",
      email: "admin@example.com",
      passwordHash: "hash",
      fullName: "Admin",
      role: "ADMIN",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result =
      await userService.findById(
        "user-a",
        "company-a",
      );

    expect(
      userRepository.findByIdAndCompany,
    ).toHaveBeenCalledWith(
      "user-a",
      "company-a",
    );

    expect(result).toMatchObject({
      id: "user-a",
      companyId: "company-a",
      email: "admin@example.com",
      fullName: "Admin",
      role: "ADMIN",
    });
  });

  it("throws when delete target does not exist in tenant", async () => {
    vi.mocked(
      userRepository.deleteByIdAndCompany,
    ).mockResolvedValue(undefined);

    await expect(
      userService.delete(
        "user-b",
        "company-a",
      ),
    ).rejects.toMatchObject({
      statusCode: 404,
      code: "USER_NOT_FOUND",
      message: "User not found",
    });
  });

  it("deletes user using both id and companyId", async () => {
    vi.mocked(
      userRepository.deleteByIdAndCompany,
    ).mockResolvedValue({
      id: "user-a",
      companyId: "company-a",
      email: "recruiter@example.com",
      passwordHash: "hash",
      fullName: "Recruiter",
      role: "RECRUITER",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result =
      await userService.delete(
        "user-a",
        "company-a",
      );

    expect(
      userRepository.deleteByIdAndCompany,
    ).toHaveBeenCalledWith(
      "user-a",
      "company-a",
    );

    expect(result).toMatchObject({
      id: "user-a",
      companyId: "company-a",
    });
  });
});

describe("createUserSchema", () => {
  it("accepts recruiter role", () => {
    const result = createUserSchema.safeParse({
      email: "recruiter@example.com",
      fullName: "Recruiter",
      password: "Password123!",
      role: "RECRUITER",
    });

    expect(result.success).toBe(true);
  });

  it("rejects admin role", () => {
    const result = createUserSchema.safeParse({
      email: "admin@example.com",
      fullName: "Admin",
      password: "Password123!",
      role: "ADMIN",
    });

    expect(result.success).toBe(false);
  });

  it("rejects missing role", () => {
    const result = createUserSchema.safeParse({
      email: "recruiter@example.com",
      fullName: "Recruiter",
      password: "Password123!",
    });

    expect(result.success).toBe(false);
  });
});
