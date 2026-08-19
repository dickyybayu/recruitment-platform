import { eq } from "drizzle-orm";

import { db } from "../../db/index.js";
import {
  companies,
  users,
} from "../../db/schema/index.js";

export const authRepository = {
  findUserByEmail(email: string) {
    return db.query.users.findFirst({
      where: eq(users.email, email),
    });
  },

  findUserById(id: string) {
    return db
      .select({
        id: users.id,
        companyId: users.companyId,
        companyName: companies.name,
        email: users.email,
        fullName: users.fullName,
        role: users.role,
      })
      .from(users)
      .innerJoin(
        companies,
        eq(users.companyId, companies.id),
      )
      .where(eq(users.id, id))
      .limit(1)
      .then((rows) => rows[0]);
  },

  async createCompanyWithAdmin(input: {
    company: {
      name: string;
      email: string;
      phone: string;
      address: string;
    };

    user: {
      email: string;
      passwordHash: string;
      fullName: string;
    };
  }) {
    return db.transaction(async (tx) => {
      const [company] = await tx
        .insert(companies)
        .values(input.company)
        .returning();

      const [user] = await tx
        .insert(users)
        .values({
          companyId: company.id,
          email: input.user.email,
          passwordHash: input.user.passwordHash,
          fullName: input.user.fullName,
          role: "ADMIN",
        })
        .returning();

      return {
        company,
        user,
      };
    });
  },
};
