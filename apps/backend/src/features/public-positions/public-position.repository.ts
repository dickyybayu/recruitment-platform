import {
  and,
  desc,
  eq,
  ilike,
  or,
} from "drizzle-orm";

import type {
  PublicPositionQuery,
} from "./public-position.schema.js";

import { db } from "../../db/index.js";

import {
  companies,
  positions,
} from "../../db/schema/index.js";

export const publicPositionRepository = {
  findAllActive(
    query: PublicPositionQuery,
  ) {
    const conditions = [
      eq(
        positions.isActive,
        true,
      ),
    ];

    if (query.search) {
      conditions.push(
        or(
          ilike(
            positions.title,
            `%${query.search}%`,
          ),
          ilike(
            positions.description,
            `%${query.search}%`,
          ),
        )!,
      );
    }

    if (query.location) {
      conditions.push(
        ilike(
          positions.location,
          `%${query.location}%`,
        ),
      );
    }

    if (query.type) {
      conditions.push(
        eq(
          positions.type,
          query.type,
        ),
      );
    }

    return db
      .select({
        id:
          positions.id,

        title:
          positions.title,

        location:
          positions.location,

        type:
          positions.type,

        salary:
          positions.salary,

        companyName:
          companies.name,

        createdAt:
          positions.createdAt,
      })
      .from(positions)
      .innerJoin(
        companies,
        eq(
          positions.companyId,
          companies.id,
        ),
      )
      .where(
        and(...conditions),
      )
      .orderBy(
        desc(
          positions.createdAt,
        ),
      );
  },

  async findActiveById(
    id: string,
  ) {
    const [position] =
      await db
        .select({
          id:
            positions.id,

          title:
            positions.title,

          location:
            positions.location,

          type:
            positions.type,

          description:
            positions.description,

          salary:
            positions.salary,

          companyName:
            companies.name,

          createdAt:
            positions.createdAt,
        })
        .from(positions)
        .innerJoin(
          companies,
          eq(
            positions.companyId,
            companies.id,
          ),
        )
        .where(
          and(
            eq(
              positions.id,
              id,
            ),
            eq(
              positions.isActive,
              true,
            ),
          ),
        )
        .limit(1);

    return position;
  },
};