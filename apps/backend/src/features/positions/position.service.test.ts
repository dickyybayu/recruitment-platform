import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  positionRepository,
} from "./position.repository.js";

import {
  positionService,
} from "./position.service.js";

vi.mock("./position.repository.js", () => ({
  positionRepository: {
    create: vi.fn(),
    findAllByCompany: vi.fn(),
    findByIdAndCompany: vi.fn(),
    updateByIdAndCompany: vi.fn(),
    deleteByIdAndCompany: vi.fn(),
  },
}));

describe("positionService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates position with authenticated companyId and userId", async () => {
    vi.mocked(
      positionRepository.create,
    ).mockResolvedValue({
      id: "position-1",
      companyId: "company-a",
      title: "Backend Engineer",
      location: "Jakarta",
      type: "FULL_TIME",
      description: "Build backend",
      salary: "10-15 juta",
      isActive: true,
      createdBy: "user-a",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result =
      await positionService.create(
        {
          title: "Backend Engineer",
          location: "Jakarta",
          type: "FULL_TIME",
          description: "Build backend",
          salary: "10-15 juta",
        },
        {
          id: "user-a",
          companyId: "company-a",
        },
      );

    expect(
      positionRepository.create,
    ).toHaveBeenCalledWith({
      title: "Backend Engineer",
      location: "Jakarta",
      type: "FULL_TIME",
      description: "Build backend",
      salary: "10-15 juta",
      companyId: "company-a",
      createdBy: "user-a",
    });

    expect(result).toMatchObject({
      id: "position-1",
      companyId: "company-a",
      createdBy: "user-a",
    });
  });

    it(
    "lists positions with tenant pagination and sorting",
    async () => {
        vi.mocked(
        positionRepository.findAllByCompany,
        ).mockResolvedValue({
        data: [],
        total: 25,
        });

        const result =
        await positionService.findAll(
            "company-a",
            {
            page: 2,
            limit: 10,
            sortBy: "createdAt",
            sortOrder: "desc",
            },
        );

        expect(
        positionRepository.findAllByCompany,
        ).toHaveBeenCalledWith(
        "company-a",
        {
            page: 2,
            limit: 10,
            sortBy: "createdAt",
            sortOrder: "desc",
        },
        );

        expect(result.positions).toEqual([]);

        expect(result.pagination).toEqual({
        page: 2,
        limit: 10,
        total: 25,
        totalPages: 3,
        });
    },
    );

  it("throws 404 when position is not found in tenant", async () => {
    vi.mocked(
      positionRepository.findByIdAndCompany,
    ).mockResolvedValue(undefined);

    await expect(
      positionService.findById(
        "position-b",
        "company-a",
      ),
    ).rejects.toMatchObject({
      statusCode: 404,
      code: "POSITION_NOT_FOUND",
      message: "Position not found",
    });
  });

  it("finds position using both id and companyId", async () => {
    vi.mocked(
      positionRepository.findByIdAndCompany,
    ).mockResolvedValue({
      id: "position-a",
      companyId: "company-a",
      title: "Backend Engineer",
      location: "Jakarta",
      type: "FULL_TIME",
      description: "Build backend",
      salary: "10-15 juta",
      isActive: true,
      createdBy: "user-a",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result =
      await positionService.findById(
        "position-a",
        "company-a",
      );

    expect(
      positionRepository.findByIdAndCompany,
    ).toHaveBeenCalledWith(
      "position-a",
      "company-a",
    );

    expect(result).toMatchObject({
      id: "position-a",
      companyId: "company-a",
    });
  });

  it("passes tenant companyId on update", async () => {
    vi.mocked(
      positionRepository.updateByIdAndCompany,
    ).mockResolvedValue({
      id: "position-a",
      companyId: "company-a",
      title: "Updated",
      location: "Jakarta",
      type: "FULL_TIME",
      description: "Updated",
      salary: "10 juta",
      isActive: true,
      createdBy: "user-a",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result =
      await positionService.update(
        "position-a",
        "company-a",
        {
          title: "Updated",
        },
      );

    expect(
      positionRepository.updateByIdAndCompany,
    ).toHaveBeenCalledWith(
      "position-a",
      "company-a",
      {
        title: "Updated",
      },
    );

    expect(result).toMatchObject({
      id: "position-a",
      companyId: "company-a",
      title: "Updated",
    });
  });

  it("throws 404 when updating position outside tenant", async () => {
    vi.mocked(
      positionRepository.updateByIdAndCompany,
    ).mockResolvedValue(undefined);

    await expect(
      positionService.update(
        "position-b",
        "company-a",
        {
          title: "Hack",
        },
      ),
    ).rejects.toMatchObject({
      statusCode: 404,
      code: "POSITION_NOT_FOUND",
      message: "Position not found",
    });
  });

  it("deletes position using both id and companyId", async () => {
    vi.mocked(
      positionRepository.deleteByIdAndCompany,
    ).mockResolvedValue({
      id: "position-a",
      companyId: "company-a",
      title: "Backend Engineer",
      location: "Jakarta",
      type: "FULL_TIME",
      description: "Build backend",
      salary: "10-15 juta",
      isActive: true,
      createdBy: "user-a",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result =
      await positionService.delete(
        "position-a",
        "company-a",
      );

    expect(
      positionRepository.deleteByIdAndCompany,
    ).toHaveBeenCalledWith(
      "position-a",
      "company-a",
    );

    expect(result).toMatchObject({
      id: "position-a",
      companyId: "company-a",
    });
  });

  it("throws 404 when deleting position outside tenant", async () => {
    vi.mocked(
      positionRepository.deleteByIdAndCompany,
    ).mockResolvedValue(undefined);

    await expect(
      positionService.delete(
        "position-b",
        "company-a",
      ),
    ).rejects.toMatchObject({
      statusCode: 404,
      code: "POSITION_NOT_FOUND",
      message: "Position not found",
    });
  });
});