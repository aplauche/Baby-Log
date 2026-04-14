import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

const dbPath = process.env.DB_PATH || "./data/baby-log.db";

const client = createClient({
  url: `file:${dbPath}`,
});

export const db = drizzle(client, { schema });
