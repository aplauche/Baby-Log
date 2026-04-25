import type { Tool } from "@anthropic-ai/sdk/resources/messages";
import { db } from "@/db";
import { entries } from "@/db/schema";
import { gte, desc } from "drizzle-orm";

export const getEntriesToolDef: Tool = {
  name: "get_baby_log_entries",
  description:
    "Fetch baby log entries from the last N days. Returns feeding details (type, bottle amount in ml, breast durations per side), diaper events (pee/poop with timestamps), and any comments. Use this to answer questions about the baby's patterns, schedules, and trends.",
  input_schema: {
    type: "object" as const,
    properties: {
      days: {
        type: "number",
        description: "Number of days to look back (1-30). Default 7.",
      },
    },
    required: ["days"],
  },
};

export async function executeGetEntries(days: number): Promise<string> {
  const clampedDays = Math.max(1, Math.min(30, days));
  const since = getDateNDaysAgo(clampedDays);

  const rows = await db
    .select()
    .from(entries)
    .where(gte(entries.entryDate, since))
    .orderBy(desc(entries.entryDate), desc(entries.entryTime));

  return JSON.stringify(rows);
}

function getDateNDaysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}
