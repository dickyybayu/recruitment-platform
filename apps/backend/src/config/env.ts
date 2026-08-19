import "dotenv/config";
import { z } from "zod";

const optionalBoolean = z
  .enum(["true", "false"])
  .transform((value) => value === "true")
  .optional();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z.coerce.number().default(3001),

  DATABASE_URL: z.string().min(1),

  JWT_SECRET: z.string().min(32),

  FRONTEND_URL: z.string().url(),

  AUTH_COOKIE_NAME: z.string().min(1).default("access_token"),

  AUTH_COOKIE_SAME_SITE: z
    .enum(["Strict", "Lax", "None"])
    .default("Lax"),

  AUTH_COOKIE_MAX_AGE_SECONDS: z.coerce
    .number()
    .int()
    .positive()
    .default(60 * 60 * 24),

  AUTH_COOKIE_SECURE: optionalBoolean,
});

const parsedEnv = envSchema.parse(process.env);

export const env = {
  ...parsedEnv,
  AUTH_COOKIE_SECURE:
    parsedEnv.AUTH_COOKIE_SECURE ??
    parsedEnv.NODE_ENV === "production",
};
