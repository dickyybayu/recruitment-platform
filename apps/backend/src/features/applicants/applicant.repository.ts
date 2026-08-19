import {
  and,
  asc,
  count,
  desc,
  eq,
} from "drizzle-orm";

import { db } from "../../db/index.js";

import {
  applicants,
  positions,
} from "../../db/schema/index.js";

type Applicant =
  typeof applicants.$inferSelect;

type ApplicantWithPosition =
  Applicant & {
    positionTitle: string;
    companyId: string;
  };

export const applicantRepository = {
  findActivePositionById(
    positionId: string,
  ) {
    return db.query.positions.findFirst({
      where: and(
        eq(
          positions.id,
          positionId,
        ),
        eq(
          positions.isActive,
          true,
        ),
      ),
    });
  },

  async create(input: {
    positionId: string;
    fullName: string;
    email: string;
    phone: string;
    education: string;
    experience: number;
    resumeUrl: string;
  }) {
    const [applicant] = await db
      .insert(applicants)
      .values({
        ...input,
        status: "APPLIED",
      })
      .returning();

    return applicant;
  },

  async findAllByCompany(
    companyId: string,
    query: {
      positionId?: string;

      status?:
        | "APPLIED"
        | "REVIEWED"
        | "INTERVIEW"
        | "ACCEPTED"
        | "REJECTED";

      page: number;
      limit: number;

      sortBy:
        | "createdAt"
        | "fullName"
        | "status"
        | "experience";

      sortOrder:
        | "asc"
        | "desc";
    },
  ) {
    const conditions = [
      eq(
        positions.companyId,
        companyId,
      ),
    ];

    if (query.positionId) {
      conditions.push(
        eq(
          applicants.positionId,
          query.positionId,
        ),
      );
    }

    if (query.status) {
      conditions.push(
        eq(
          applicants.status,
          query.status,
        ),
      );
    }

    const whereCondition =
      and(...conditions);

    const sortColumns = {
      createdAt:
        applicants.createdAt,

      fullName:
        applicants.fullName,

      status:
        applicants.status,

      experience:
        applicants.experience,
    };

    const sortColumn =
      sortColumns[query.sortBy];

    const orderBy =
      query.sortOrder === "asc"
        ? asc(sortColumn)
        : desc(sortColumn);

    const offset =
      (query.page - 1) *
      query.limit;

    const [data, totalResult] =
      await Promise.all([
        db
          .select({
            id:
              applicants.id,

            positionId:
              applicants.positionId,

            fullName:
              applicants.fullName,

            email:
              applicants.email,

            phone:
              applicants.phone,

            education:
              applicants.education,

            experience:
              applicants.experience,

            resumeUrl:
              applicants.resumeUrl,

            status:
              applicants.status,

            notes:
              applicants.notes,

            createdAt:
              applicants.createdAt,

            updatedAt:
              applicants.updatedAt,

            positionTitle:
              positions.title,
          })
          .from(applicants)
          .innerJoin(
            positions,
            eq(
              applicants.positionId,
              positions.id,
            ),
          )
          .where(
            whereCondition,
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
          .from(applicants)
          .innerJoin(
            positions,
            eq(
              applicants.positionId,
              positions.id,
            ),
          )
          .where(
            whereCondition,
          ),
      ]);

    return {
      data,

      total:
        totalResult[0]?.count ?? 0,
    };
  },

  async findByIdAndCompany(
    id: string,
    companyId: string,
  ): Promise<
    ApplicantWithPosition | undefined
  > {
    const [applicant] = await db
      .select({
        id:
          applicants.id,

        positionId:
          applicants.positionId,

        fullName:
          applicants.fullName,

        email:
          applicants.email,

        phone:
          applicants.phone,

        education:
          applicants.education,

        experience:
          applicants.experience,

        resumeUrl:
          applicants.resumeUrl,

        status:
          applicants.status,

        notes:
          applicants.notes,

        createdAt:
          applicants.createdAt,

        updatedAt:
          applicants.updatedAt,

        positionTitle:
          positions.title,

        companyId:
          positions.companyId,
      })
      .from(applicants)
      .innerJoin(
        positions,
        eq(
          applicants.positionId,
          positions.id,
        ),
      )
      .where(
        and(
          eq(
            applicants.id,
            id,
          ),
          eq(
            positions.companyId,
            companyId,
          ),
        ),
      )
      .limit(1);

    return applicant;
  },

  async updateStatusByIdAndCompany(
    id: string,
    companyId: string,
    status:
      | "APPLIED"
      | "REVIEWED"
      | "INTERVIEW"
      | "ACCEPTED"
      | "REJECTED",
  ): Promise<Applicant | undefined> {
    const ownedApplicant =
      await this.findByIdAndCompany(
        id,
        companyId,
      );

    if (!ownedApplicant) {
      return undefined;
    }

    const [updatedApplicant] =
      await db
        .update(applicants)
        .set({
          status,
          updatedAt: new Date(),
        })
        .where(
          eq(
            applicants.id,
            id,
          ),
        )
        .returning();

    return updatedApplicant;
  },

  async updateNotesByIdAndCompany(
    id: string,
    companyId: string,
    notes: string | null,
  ): Promise<Applicant | undefined> {
    const ownedApplicant =
      await this.findByIdAndCompany(
        id,
        companyId,
      );

    if (!ownedApplicant) {
      return undefined;
    }

    const [updatedApplicant] =
      await db
        .update(applicants)
        .set({
          notes,
          updatedAt: new Date(),
        })
        .where(
          eq(
            applicants.id,
            id,
          ),
        )
        .returning();

    return updatedApplicant;
  },

  async deleteByIdAndCompany(
    id: string,
    companyId: string,
  ): Promise<Applicant | undefined> {
    const ownedApplicant =
      await this.findByIdAndCompany(
        id,
        companyId,
      );

    if (!ownedApplicant) {
      return undefined;
    }

    const [deletedApplicant] =
      await db
        .delete(applicants)
        .where(
          eq(
            applicants.id,
            id,
          ),
        )
        .returning();

    return deletedApplicant;
  },
};