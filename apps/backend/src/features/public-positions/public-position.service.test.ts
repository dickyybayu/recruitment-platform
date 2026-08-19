import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  publicPositionRepository,
} from "./public-position.repository.js";

import {
  publicPositionService,
} from "./public-position.service.js";

vi.mock("./public-position.repository.js", () => ({
  publicPositionRepository: {
    findAllActive: vi.fn(),
    findActiveById: vi.fn(),
  },
}));

describe("publicPositionService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns all active public positions", async () => {
    vi.mocked(
      publicPositionRepository.findAllActive,
    ).mockResolvedValue([
      {
        id: "position-a",
        title: "Backend Engineer",
        location: "Jakarta",
        type: "FULL_TIME",
        salary: "10-15 juta",
        companyName: "PT Maju Jaya",
        createdAt: new Date(),
      },
    ]);

    const result =
      await publicPositionService.findAll({});

    expect(
      publicPositionRepository.findAllActive,
    ).toHaveBeenCalledWith({});

    expect(result).toHaveLength(1);

    expect(result[0]).toMatchObject({
      id: "position-a",
      title: "Backend Engineer",
      location: "Jakarta",
      type: "FULL_TIME",
      salary: "10-15 juta",
      companyName: "PT Maju Jaya",
    });
  });

  it("passes public filters to repository", async () => {
    vi.mocked(
      publicPositionRepository.findAllActive,
    ).mockResolvedValue([]);

    const query = {
      search: "backend",
      location: "Jakarta",
      type: "FULL_TIME" as const,
    };

    const result =
      await publicPositionService.findAll(
        query,
      );

    expect(
      publicPositionRepository.findAllActive,
    ).toHaveBeenCalledWith(
      query,
    );

    expect(result).toEqual([]);
  });

  it("returns public position detail when active position exists", async () => {
    vi.mocked(
      publicPositionRepository.findActiveById,
    ).mockResolvedValue({
      id: "position-a",
      title: "Backend Engineer",
      location: "Jakarta",
      type: "FULL_TIME",
      description: "Build APIs",
      salary: "10-15 juta",
      companyName: "PT Maju Jaya",
      createdAt: new Date(),
    });

    const result =
      await publicPositionService.findById(
        "position-a",
      );

    expect(
      publicPositionRepository.findActiveById,
    ).toHaveBeenCalledWith(
      "position-a",
    );

    expect(result).toMatchObject({
      id: "position-a",
      title: "Backend Engineer",
      location: "Jakarta",
      type: "FULL_TIME",
      description: "Build APIs",
      salary: "10-15 juta",
      companyName: "PT Maju Jaya",
    });
  });

  it("throws 404 when public position is inactive or missing", async () => {
    vi.mocked(
      publicPositionRepository.findActiveById,
    ).mockResolvedValue(
      undefined as any,
    );

    await expect(
      publicPositionService.findById(
        "position-x",
      ),
    ).rejects.toMatchObject({
      statusCode: 404,
      code: "POSITION_NOT_FOUND",
      message: "Position not found",
    });
  });
});