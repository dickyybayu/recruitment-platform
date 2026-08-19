import {
  and,
  asc,
  count,
  desc,
  eq,
} from "drizzle-orm";

import { db } from "../../db/index.js";
import { positions } from "../../db/schema/index.js";

type Position = typeof positions.$inferSelect;

export const positionRepository = {
  async create(input: {
    companyId: string;
    createdBy: string;

    title: string;
    location: string;

    type:
      | "FULL_TIME"
      | "PART_TIME"
      | "CONTRACT";

    description: string;
    salary: string;
    isActive?: boolean;
  }) {
    const [position] = await db
      .insert(positions)
      .values({
        ...input,
        isActive: input.isActive ?? true,
      })
      .returning();

    return position;
  },

  async findAllByCompany(
    companyId: string,
    query: {
      page: number;
      limit: number;

      sortBy:
        | "createdAt"
        | "title"
        | "location"
        | "type";

      sortOrder:
        | "asc"
        | "desc";
    },
  ) {
    const offset =
      (query.page - 1) *
      query.limit;

    const sortColumns = {
      createdAt:
        positions.createdAt,

      title:
        positions.title,

      location:
        positions.location,

      type:
        positions.type,
    };

    const sortColumn =
      sortColumns[query.sortBy];

    const orderBy =
      query.sortOrder === "asc"
        ? asc(sortColumn)
        : desc(sortColumn);

    const [data, totalResult] =
      await Promise.all([
        db
          .select()
          .from(positions)
          .where(
            eq(
              positions.companyId,
              companyId,
            ),
          )
          .orderBy(
            orderBy,
          )
          .limit(
            query.limit,
          )
          .offset(
            offset,
          ),

        db
          .select({
            count: count(),
          })
          .from(positions)
          .where(
            eq(
              positions.companyId,
              companyId,
            ),
          ),
      ]);

    const total =
      totalResult[0]?.count ?? 0;

    return {
      data,
      total,
    };
  },

  findByIdAndCompany(
    id: string,
    companyId: string,
  ) {
    return db.query.positions.findFirst({
      where: and(
        eq(
          positions.id,
          id,
        ),
        eq(
          positions.companyId,
          companyId,
        ),
      ),
    });
  },

  async updateByIdAndCompany(
    id: string,
    companyId: string,
    input: {
      title?: string;
      location?: string;

      type?:
        | "FULL_TIME"
        | "PART_TIME"
        | "CONTRACT";

      description?: string;
      salary?: string;
      isActive?: boolean;
    },
  ): Promise<Position | undefined> {
    const [position] = await db
      .update(positions)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(
            positions.id,
            id,
          ),
          eq(
            positions.companyId,
            companyId,
          ),
        ),
      )
      .returning();

    return position;
  },

  async deleteByIdAndCompany(
    id: string,
    companyId: string,
  ): Promise<Position | undefined> {
    const [position] = await db
      .delete(positions)
      .where(
        and(
          eq(
            positions.id,
            id,
          ),
          eq(
            positions.companyId,
            companyId,
          ),
        ),
      )
      .returning();

    return position;
  },
};