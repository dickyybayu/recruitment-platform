import { Hono } from "hono";

import { authRoute } from "./features/auth/auth.route.js";
import { cors } from "hono/cors";
import { env } from "./config/env.js";
import { userRoute } from "./features/users/user.route.js";
import { positionRoute } from "./features/positions/position.route.js";
import { applicantRoute } from "./features/applicants/applicant.route.js";
import { publicPositionRoute } from "./features/public-positions/public-position.route.js";
import { AppError } from "./lib/app-error.js";

const app = new Hono();

app.use(
  "/api/*",
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);

app.get("/health", (c) => {
  return c.json({
    success: true,
    message: "API is healthy",
  });
});

app.route("/api/auth", authRoute);
app.route("/api/users", userRoute);
app.route("/api/positions", positionRoute);
app.route("/api/applicants", applicantRoute);
app.route("/api/public/positions", publicPositionRoute);


app.onError((error, c) => {
  if (error instanceof AppError) {
    return c.json(
      {
        success: false,
        message: error.message,
        code: error.code,
      },
      error.statusCode as any,
    );
  }

  console.error(error);

  return c.json(
    {
      success: false,
      message: "Internal server error",
    },
    500,
  );
});

export default app;