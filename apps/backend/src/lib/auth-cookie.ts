import type { Context } from "hono";
import {
  deleteCookie,
  setCookie,
} from "hono/cookie";

import { env } from "../config/env.js";

export const AUTH_COOKIE_NAME = env.AUTH_COOKIE_NAME;

export function setAuthCookie(
  c: Context,
  token: string,
) {
  setCookie(
    c,
    AUTH_COOKIE_NAME,
    token,
    {
      httpOnly: true,

      secure: env.AUTH_COOKIE_SECURE,

      sameSite: env.AUTH_COOKIE_SAME_SITE,

      path: "/",

      maxAge: env.AUTH_COOKIE_MAX_AGE_SECONDS,
    },
  );
}

export function clearAuthCookie(c: Context) {
  deleteCookie(
    c,
    AUTH_COOKIE_NAME,
    {
      path: "/",
    },
  );
}
