import { AppError } from "../../lib/app-error.js";

import {
  positionRepository,
} from "./position.repository.js";

import type {
  CreatePositionInput,
  PositionQuery,
  UpdatePositionInput,
} from "./position.schema.js";

export const positionService = {
  async create(
    input: CreatePositionInput,
    currentUser: {
      id: string;
      companyId: string;
    },
  ) {
    return positionRepository.create({
      ...input,
      companyId: currentUser.companyId,
      createdBy: currentUser.id,
    });
  },

  async findAll(
    companyId: string,
    query: PositionQuery,
    ) {
    const result =
        await positionRepository
        .findAllByCompany(
            companyId,
            query,
        );

    const totalPages =
        Math.ceil(
        result.total / query.limit,
        );

    return {
        positions: result.data,

        pagination: {
        page: query.page,
        limit: query.limit,
        total: result.total,
        totalPages,
        },

        sorting: {
        sortBy: query.sortBy,
        sortOrder: query.sortOrder,
        },
    };
    },

  async findById(
    id: string,
    companyId: string,
  ) {
    const position =
      await positionRepository.findByIdAndCompany(
        id,
        companyId,
      );

    if (!position) {
      throw new AppError(
        404,
        "Position not found",
        "POSITION_NOT_FOUND",
      );
    }

    return position;
  },

  async update(
    id: string,
    companyId: string,
    input: UpdatePositionInput,
  ) {
    const position =
      await positionRepository.updateByIdAndCompany(
        id,
        companyId,
        input,
      );

    if (!position) {
      throw new AppError(
        404,
        "Position not found",
        "POSITION_NOT_FOUND",
      );
    }

    return position;
  },

  async delete(
    id: string,
    companyId: string,
  ) {
    const position =
      await positionRepository.deleteByIdAndCompany(
        id,
        companyId,
      );

    if (!position) {
      throw new AppError(
        404,
        "Position not found",
        "POSITION_NOT_FOUND",
      );
    }

    return position;
  },
};