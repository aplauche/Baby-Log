import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { entries } from "@/db/schema";
import { gte, and, sql } from "drizzle-orm";

function getDateNDaysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const days = parseInt(searchParams.get("days") || "7", 10);
  const since = getDateNDaysAgo(days);

  // All entries in range
  const rows = await db
    .select()
    .from(entries)
    .where(gte(entries.entryDate, since));

  // Compute aggregates
  const totalFeedings = rows.filter((r) => r.foodType !== null).length;
  const bottleFeedings = rows.filter((r) => r.foodType === "bottle");
  const breastFeedings = rows.filter((r) => r.foodType === "breast");

  const avgBottleMl =
    bottleFeedings.length > 0
      ? bottleFeedings.reduce((sum, r) => sum + (r.bottleAmountMl || 0), 0) /
        bottleFeedings.length
      : 0;

  const avgBreastMin =
    breastFeedings.length > 0
      ? breastFeedings.reduce((sum, r) => sum + (r.breastDurationMin || 0), 0) /
        breastFeedings.length
      : 0;

  const totalPee = rows.filter((r) => r.pee).length;
  const totalPoop = rows.filter((r) => r.poop).length;

  const feedingsPerDay = days > 0 ? totalFeedings / days : 0;
  const peePerDay = days > 0 ? totalPee / days : 0;
  const poopPerDay = days > 0 ? totalPoop / days : 0;

  // Daily breakdown for charts
  const dailyMap: Record<
    string,
    { feedings: number; bottle: number; breast: number; pee: number; poop: number; bottleMl: number }
  > = {};

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    dailyMap[key] = { feedings: 0, bottle: 0, breast: 0, pee: 0, poop: 0, bottleMl: 0 };
  }

  for (const row of rows) {
    const key = row.entryDate;
    if (!dailyMap[key]) continue;
    if (row.foodType) {
      dailyMap[key].feedings++;
      if (row.foodType === "bottle") {
        dailyMap[key].bottle++;
        dailyMap[key].bottleMl += row.bottleAmountMl || 0;
      }
      if (row.foodType === "breast") dailyMap[key].breast++;
    }
    if (row.pee) dailyMap[key].pee++;
    if (row.poop) dailyMap[key].poop++;
  }

  const daily = Object.entries(dailyMap).map(([date, data]) => ({
    date,
    ...data,
  }));

  return NextResponse.json({
    days,
    totalFeedings,
    feedingsPerDay: Math.round(feedingsPerDay * 10) / 10,
    avgBottleMl: Math.round(avgBottleMl),
    avgBreastMin: Math.round(avgBreastMin * 10) / 10,
    totalPee,
    totalPoop,
    peePerDay: Math.round(peePerDay * 10) / 10,
    poopPerDay: Math.round(poopPerDay * 10) / 10,
    bottleCount: bottleFeedings.length,
    breastCount: breastFeedings.length,
    daily,
  });
}
