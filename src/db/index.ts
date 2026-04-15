import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

const client =
  process.env.DB_DRIVER === "turso"
    ? createClient({
        url: process.env.TURSO_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN!,
      })
    : createClient({ url: `file:${process.env.DB_PATH || "./data/baby-log.db"}` });

export const db = drizzle(client, { schema });
