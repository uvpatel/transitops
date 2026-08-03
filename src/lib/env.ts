import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  BETTER_AUTH_SECRET: z.string().min(1, "BETTER_AUTH_SECRET is required"),
  BETTER_AUTH_URL: z.string().url().default("http://localhost:3000"),
  GITHUB_CLIENT_ID: z.string().optional().default(""),
  GITHUB_CLIENT_SECRET: z.string().optional().default(""),
  NEXT_PUBLIC_APP_URL: z.string().url().optional().default("http://localhost:3000"),
});

const _env = envSchema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL,
});

if (!_env.success) {
  console.warn("⚠️ Environment variables validation warning:", _env.error.format());
}

export const env = _env.success
  ? _env.data
  : {
      DATABASE_URL: process.env.DATABASE_URL || "",
      BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET || "",
      BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
      GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || "",
      GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || "",
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    };
