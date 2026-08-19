import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  applicantRepository,
} from "./applicant.repository.js";

import {
  applicantService,
} from "./applicant.service.js";

vi.mock("./applicant.repository.js", () => ({
  applicantRepository: {
    findActivePositionById: vi.fn(),
    create: vi.fn(),
    findAllByCompany: vi.fn(),
    findByIdAndCompany: vi.fn(),
    updateStatusByIdAndCompany: vi.fn(),
    updateNotesByIdAndCompany: vi.fn(),
    deleteByIdAndCompany: vi.fn(),
  },
}));

describe("applicantService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it(
    "rejects application when position is inactive or missing",
    async () => {
      vi.mocked(
        applicantRepository.findActivePositionById,
      ).mockResolvedValue(undefined);

      await expect(
        applicantService.create({
          positionId: "position-x",
          fullName: "Candidate",
          email: "candidate@example.com",
          phone: "08123456789",
          education: "S1 Informatika",
          experience: 2,
          resumeUrl:
            "https://example.com/resume.pdf",
        }),
      ).rejects.toMatchObject({
        statusCode: 404,
        code: "POSITION_NOT_FOUND_OR_INACTIVE",
        message: "Position not found or inactive",
      });

      expect(
        applicantRepository.create,
      ).not.toHaveBeenCalled();
    },
  );

  it(
    "creates applicant when active position exists",
    async () => {
      vi.mocked(
        applicantRepository.findActivePositionById,
      ).mockResolvedValue({
        id: "position-a",
        companyId: "company-a",
        title: "Backend Engineer",
        location: "Jakarta",
        type: "FULL_TIME",
        description: "Backend",
        salary: "10 juta",
        isActive: true,
        createdBy: "user-a",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      vi.mocked(
        applicantRepository.create,
      ).mockResolvedValue({
        id: "applicant-1",
        positionId: "position-a",
        fullName: "Candidate",
        email: "candidate@example.com",
        phone: "08123456789",
        education: "S1 Informatika",
        experience: 2,
        resumeUrl:
          "https://example.com/resume.pdf",
        status: "APPLIED",
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const input = {
        positionId: "position-a",
        fullName: "Candidate",
        email: "candidate@example.com",
        phone: "08123456789",
        education: "S1 Informatika",
        experience: 2,
        resumeUrl:
          "https://example.com/resume.pdf",
      };

      const result =
        await applicantService.create(
          input,
        );

      expect(
        applicantRepository.findActivePositionById,
      ).toHaveBeenCalledWith(
        "position-a",
      );

      expect(
        applicantRepository.create,
      ).toHaveBeenCalledWith(
        input,
      );

      expect(result).toMatchObject({
        id: "applicant-1",
        positionId: "position-a",
        status: "APPLIED",
      });
    },
  );

  it(
    "lists applicants with tenant pagination and sorting",
    async () => {
      const query = {
        page: 1,
        limit: 10,
        sortBy: "createdAt" as const,
        sortOrder: "desc" as const,
      };

      vi.mocked(
        applicantRepository.findAllByCompany,
      ).mockResolvedValue({
        data: [],
        total: 21,
      });

      const result =
        await applicantService.findAll(
          "company-a",
          query,
        );

      expect(
        applicantRepository.findAllByCompany,
      ).toHaveBeenCalledWith(
        "company-a",
        query,
      );

      expect(
        result.applicants,
      ).toEqual([]);

      expect(
        result.pagination,
      ).toEqual({
        page: 1,
        limit: 10,
        total: 21,
        totalPages: 3,
      });

      expect(
        result.sorting,
      ).toEqual({
        sortBy: "createdAt",
        sortOrder: "desc",
      });
    },
  );

  it(
    "throws 404 when applicant is not found in tenant",
    async () => {
      vi.mocked(
        applicantRepository.findByIdAndCompany,
      ).mockResolvedValue(undefined);

      await expect(
        applicantService.findById(
          "applicant-b",
          "company-a",
        ),
      ).rejects.toMatchObject({
        statusCode: 404,
        code: "APPLICANT_NOT_FOUND",
        message: "Applicant not found",
      });
    },
  );

  it(
    "finds applicant using both id and companyId",
    async () => {
      vi.mocked(
        applicantRepository.findByIdAndCompany,
      ).mockResolvedValue({
        id: "applicant-a",
        positionId: "position-a",
        fullName: "Candidate",
        email: "candidate@example.com",
        phone: "08123456789",
        education: "S1",
        experience: 2,
        resumeUrl:
          "https://example.com/resume.pdf",
        status: "APPLIED",
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),

        positionTitle:
          "Backend Engineer",

        companyId:
          "company-a",
      });

      const result =
        await applicantService.findById(
          "applicant-a",
          "company-a",
        );

      expect(
        applicantRepository.findByIdAndCompany,
      ).toHaveBeenCalledWith(
        "applicant-a",
        "company-a",
      );

      expect(result).toMatchObject({
        id: "applicant-a",
        positionId: "position-a",
        positionTitle:
          "Backend Engineer",
        companyId:
          "company-a",
      });
    },
  );

  it(
    "updates status using applicant id and tenant companyId",
    async () => {
      vi.mocked(
        applicantRepository.updateStatusByIdAndCompany,
      ).mockResolvedValue({
        id: "applicant-a",
        positionId: "position-a",
        fullName: "Candidate",
        email: "candidate@example.com",
        phone: "08123456789",
        education: "S1",
        experience: 2,
        resumeUrl:
          "https://example.com/resume.pdf",
        status: "INTERVIEW",
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result =
        await applicantService.updateStatus(
          "applicant-a",
          "company-a",
          "INTERVIEW",
        );

      expect(
        applicantRepository.updateStatusByIdAndCompany,
      ).toHaveBeenCalledWith(
        "applicant-a",
        "company-a",
        "INTERVIEW",
      );

      expect(
        result.status,
      ).toBe(
        "INTERVIEW",
      );
    },
  );

  it(
    "throws 404 when updating status of applicant outside tenant",
    async () => {
      vi.mocked(
        applicantRepository.updateStatusByIdAndCompany,
      ).mockResolvedValue(undefined);

      await expect(
        applicantService.updateStatus(
          "applicant-b",
          "company-a",
          "INTERVIEW",
        ),
      ).rejects.toMatchObject({
        statusCode: 404,
        code: "APPLICANT_NOT_FOUND",
        message: "Applicant not found",
      });
    },
  );

  it(
    "updates notes using applicant id and tenant companyId",
    async () => {
      vi.mocked(
        applicantRepository.updateNotesByIdAndCompany,
      ).mockResolvedValue({
        id: "applicant-a",
        positionId: "position-a",
        fullName: "Candidate",
        email: "candidate@example.com",
        phone: "08123456789",
        education: "S1",
        experience: 2,
        resumeUrl:
          "https://example.com/resume.pdf",
        status: "APPLIED",
        notes:
          "Strong candidate",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result =
        await applicantService.updateNotes(
          "applicant-a",
          "company-a",
          "Strong candidate",
        );

      expect(
        applicantRepository.updateNotesByIdAndCompany,
      ).toHaveBeenCalledWith(
        "applicant-a",
        "company-a",
        "Strong candidate",
      );

      expect(
        result.notes,
      ).toBe(
        "Strong candidate",
      );
    },
  );

  it(
    "throws 404 when updating notes outside tenant",
    async () => {
      vi.mocked(
        applicantRepository.updateNotesByIdAndCompany,
      ).mockResolvedValue(undefined);

      await expect(
        applicantService.updateNotes(
          "applicant-b",
          "company-a",
          "Should fail",
        ),
      ).rejects.toMatchObject({
        statusCode: 404,
        code: "APPLICANT_NOT_FOUND",
        message: "Applicant not found",
      });
    },
  );

  it(
    "deletes applicant using both id and companyId",
    async () => {
      vi.mocked(
        applicantRepository.deleteByIdAndCompany,
      ).mockResolvedValue({
        id: "applicant-a",
        positionId: "position-a",
        fullName: "Candidate",
        email: "candidate@example.com",
        phone: "08123456789",
        education: "S1",
        experience: 2,
        resumeUrl:
          "https://example.com/resume.pdf",
        status: "APPLIED",
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await applicantService.delete(
        "applicant-a",
        "company-a",
      );

      expect(
        applicantRepository.deleteByIdAndCompany,
      ).toHaveBeenCalledWith(
        "applicant-a",
        "company-a",
      );
    },
  );

  it(
    "throws 404 when deleting applicant outside tenant",
    async () => {
      vi.mocked(
        applicantRepository.deleteByIdAndCompany,
      ).mockResolvedValue(undefined);

      await expect(
        applicantService.delete(
          "applicant-b",
          "company-a",
        ),
      ).rejects.toMatchObject({
        statusCode: 404,
        code: "APPLICANT_NOT_FOUND",
        message: "Applicant not found",
      });
    },
  );
});