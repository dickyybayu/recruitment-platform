import {
  and,
  eq,
} from "drizzle-orm";

import { db } from "../../db/index.js";
import { users } from "../../db/schema/index.js";

type User = typeof users.$inferSelect;

export const userRepository = {
  findByEmail(email: string) {
    return db.query.users.findFirst({
      where: eq(
        users.email,
        email,
      ),
    });
  },

  findAllByCompany(
    companyId: string,
  ) {
    return db.query.users.findMany({
      where: eq(
        users.companyId,
        companyId,
      ),
    });
  },

  findByIdAndCompany(
    id: string,
    companyId: string,
  ) {
    return db.query.users.findFirst({
      where: and(
        eq(
          users.id,
          id,
        ),
        eq(
          users.companyId,
          companyId,
        ),
      ),
    });
  },

  async create(input: {
    companyId: string;
    email: string;
    passwordHash: string;
    fullName: string;
    role: "ADMIN" | "RECRUITER";
  }): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(input)
      .returning();

    return user;
  },

  async deleteByIdAndCompany(
    id: string,
    companyId: string,
  ): Promise<User | undefined> {
    const [deletedUser] = await db
      .delete(users)
      .where(
        and(
          eq(
            users.id,
            id,
          ),
          eq(
            users.companyId,
            companyId,
          ),
        ),
      )
      .returning();

    return deletedUser;
  },
};