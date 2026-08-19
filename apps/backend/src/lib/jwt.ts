
import { sign, verify } from "hono/jwt";

import { env } from "../config/env.js";

export type JwtPayload = {
  sub: string;
  exp: number;
};

export async function createAccessToken(userId: string) {
  const now = Math.floor(Date.now() / 1000);

  const payload: JwtPayload = {
    sub: userId,
    exp: now + 60 * 60 * 24,
  };

  return sign(payload, env.JWT_SECRET, "HS256");
}

export async function verifyAccessToken(token: string) {
  return verify(token, env.JWT_SECRET, "HS256");
}