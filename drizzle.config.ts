import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  ...(process.env.DB_DRIVER === "turso"
    ? {
        dialect: "turso" as const,
        dbCredentials: { url: process.env.TURSO_URL!, authToken: process.env.TURSO_AUTH_TOKEN },
      }
    : {
        dialect: "sqlite" as const,
        dbCredentials: { url: `file:${process.env.DB_PATH || "./data/baby-log.db"}` },
      }),
});
