import { AppError } from "../../lib/app-error.js";

import {
  applicantRepository,
} from "./applicant.repository.js";

import type {
  ApplicantQuery,
  ApplicantStatus,
  CreateApplicantInput,
} from "./applicant.schema.js";

export const applicantService = {
  async create(
    input: CreateApplicantInput,
  ) {
    const position =
      await applicantRepository
        .findActivePositionById(
          input.positionId,
        );

    if (!position) {
      throw new AppError(
        404,
        "Position not found or inactive",
        "POSITION_NOT_FOUND_OR_INACTIVE",
      );
    }

    return applicantRepository.create(
      input,
    );
  },

  async findAll(
    companyId: string,
    query: ApplicantQuery,
    ) {
    const result =
        await applicantRepository
        .findAllByCompany(
            companyId,
            query,
        );

    return {
        applicants:
        result.data,

        pagination: {
        page:
            query.page,

        limit:
            query.limit,

        total:
            result.total,

        totalPages:
            Math.ceil(
            result.total /
            query.limit,
            ),
        },

        sorting: {
        sortBy:
            query.sortBy,

        sortOrder:
            query.sortOrder,
        },
    };
    },

  async findById(
    id: string,
    companyId: string,
  ) {
    const applicant =
      await applicantRepository
        .findByIdAndCompany(
          id,
          companyId,
        );

    if (!applicant) {
      throw new AppError(
        404,
        "Applicant not found",
        "APPLICANT_NOT_FOUND",
      );
    }

    return applicant;
  },

  async updateStatus(
    id: string,
    companyId: string,
    status: ApplicantStatus
  ) {
    const applicant =
      await applicantRepository
        .updateStatusByIdAndCompany(
          id,
          companyId,
          status,
        );

    if (!applicant) {
      throw new AppError(
        404,
        "Applicant not found",
        "APPLICANT_NOT_FOUND",
      );
    }

    return applicant;
  },

  async updateNotes(
    id: string,
    companyId: string,
    notes: string | null,
  ) {
    const applicant =
      await applicantRepository
        .updateNotesByIdAndCompany(
          id,
          companyId,
          notes,
        );

    if (!applicant) {
      throw new AppError(
        404,
        "Applicant not found",
        "APPLICANT_NOT_FOUND",
      );
    }

    return applicant;
  },

  async delete(
    id: string,
    companyId: string,
  ) {
    const applicant =
      await applicantRepository
        .deleteByIdAndCompany(
          id,
          companyId,
        );

    if (!applicant) {
      throw new AppError(
        404,
        "Applicant not found",
        "APPLICANT_NOT_FOUND",
      );
    }
  },
};