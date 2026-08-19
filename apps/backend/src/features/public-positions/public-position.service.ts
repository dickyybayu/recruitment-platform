import { AppError } from "../../lib/app-error.js";

import {
  publicPositionRepository,
} from "./public-position.repository.js";

import type {
  PublicPositionQuery,
} from "./public-position.schema.js";


export const publicPositionService = {
  findAll(query: PublicPositionQuery) {
    return publicPositionRepository
      .findAllActive(query);
  },

  async findById(id: string) {
    const position =
      await publicPositionRepository
        .findActiveById(id);

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