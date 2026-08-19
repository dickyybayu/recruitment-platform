import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

import { db } from "./index.js";
import {
  applicants,
  companies,
  positions,
  users,
} from "./schema/index.js";

async function seed() {
  console.log("Seeding database...");

  const existingAdmin = await db.query.users.findFirst({
    where: eq(users.email, "admin.a@example.com"),
  });

  if (existingAdmin) {
    console.log("Seed data already exists. Skipping...");
    return;
  }

  const passwordHash = await bcrypt.hash("Password123!", 10);

  const [companyA] = await db
    .insert(companies)
    .values({
      name: "PT Maju Jaya",
      email: "hr@majujaya.com",
      phone: "0215550001",
      address: "Jakarta",
    })
    .returning();

  const [companyB] = await db
    .insert(companies)
    .values({
      name: "PT Sukses Bersama",
      email: "hr@suksesbersama.com",
      phone: "0215550002",
      address: "Bandung",
    })
    .returning();

  const [adminA] = await db
    .insert(users)
    .values({
      companyId: companyA.id,
      email: "admin.a@example.com",
      passwordHash,
      fullName: "Admin Company A",
      role: "ADMIN",
    })
    .returning();

  await db.insert(users).values({
    companyId: companyA.id,
    email: "recruiter.a@example.com",
    passwordHash,
    fullName: "Recruiter Company A",
    role: "RECRUITER",
  });

  const [adminB] = await db
    .insert(users)
    .values({
      companyId: companyB.id,
      email: "admin.b@example.com",
      passwordHash,
      fullName: "Admin Company B",
      role: "ADMIN",
    })
    .returning();

  await db.insert(users).values({
    companyId: companyB.id,
    email: "recruiter.b@example.com",
    passwordHash,
    fullName: "Recruiter Company B",
    role: "RECRUITER",
  });

  const [positionA1] = await db
    .insert(positions)
    .values({
      companyId: companyA.id,
      title: "Backend Developer",
      location: "Jakarta",
      type: "FULL_TIME",
      description: "Develop and maintain backend services.",
      salary: "8-12 juta",
      isActive: true,
      createdBy: adminA.id,
    })
    .returning();

  await db.insert(positions).values({
    companyId: companyA.id,
    title: "Frontend Developer",
    location: "Jakarta",
    type: "FULL_TIME",
    description: "Build modern web interfaces.",
    salary: "7-10 juta",
    isActive: true,
    createdBy: adminA.id,
  });

  const [positionB1] = await db
    .insert(positions)
    .values({
      companyId: companyB.id,
      title: "UI/UX Designer",
      location: "Bandung",
      type: "CONTRACT",
      description: "Design user-friendly product experiences.",
      salary: "6-9 juta",
      isActive: true,
      createdBy: adminB.id,
    })
    .returning();

  await db.insert(positions).values({
    companyId: companyB.id,
    title: "HR Recruiter",
    location: "Bandung",
    type: "FULL_TIME",
    description: "Manage recruitment and candidate pipelines.",
    salary: "5-8 juta",
    isActive: true,
    createdBy: adminB.id,
  });

  await db.insert(applicants).values([
    {
      positionId: positionA1.id,
      fullName: "Andi Saputra",
      email: "andi@example.com",
      phone: "081234567890",
      education: "S1 Informatika",
      experience: 2,
      resumeUrl: "https://example.com/resume/andi",
      status: "APPLIED",
    },
    {
      positionId: positionB1.id,
      fullName: "Budi Santoso",
      email: "budi@example.com",
      phone: "081298765432",
      education: "S1 Desain",
      experience: 3,
      resumeUrl: "https://example.com/resume/budi",
      status: "INTERVIEW",
      notes: "Strong portfolio.",
    },
  ]);

  console.log("Seed completed.");
}

seed()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });