import type { Context } from "hono";
import {
  deleteCookie,
  setCookie,
} from "hono/cookie";

import { env } from "../config/env.js";

export const AUTH_COOKIE_NAME = "access_token";

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

      secure:
        env.NODE_ENV === "production",

      sameSite: "Lax",

      path: "/",

      maxAge: 60 * 60 * 24,
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