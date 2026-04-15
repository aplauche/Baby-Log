import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { entries } from "@/db/schema";
import { gte } from "drizzle-orm";

function getDateNDaysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}

type Bucket = { feedings: number; bottle: number; breast: number; pee: number; poop: number; bottleMl: number };

function emptyBucket(): Bucket {
  return { feedings: 0, bottle: 0, breast: 0, pee: 0, poop: 0, bottleMl: 0 };
}

function accumulate(bucket: Bucket, row: { foodType: string | null; bottleAmountMl: number | null; pee: boolean; poop: boolean }) {
  if (row.foodType) {
    bucket.feedings++;
    if (row.foodType === "bottle" || row.foodType === "both") {
      bucket.bottle++;
      bucket.bottleMl += row.bottleAmountMl || 0;
    }
    if (row.foodType === "breast" || row.foodType === "both") bucket.breast++;
  }
  if (row.pee) bucket.pee++;
  if (row.poop) bucket.poop++;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const days = parseInt(searchParams.get("days") || "7", 10);
  const since = getDateNDaysAgo(days);

  const rows = await db
    .select()
    .from(entries)
    .where(gte(entries.entryDate, since));

  // Aggregates (same for all intervals)
  const totalFeedings = rows.filter((r) => r.foodType !== null).length;
  const bottleFeedings = rows.filter((r) => r.foodType === "bottle" || r.foodType === "both");
  const breastFeedings = rows.filter((r) => r.foodType === "breast" || r.foodType === "both");

  const avgBottleMl =
    bottleFeedings.length > 0
      ? bottleFeedings.reduce((sum, r) => sum + (r.bottleAmountMl || 0), 0) / bottleFeedings.length
      : 0;

  const avgBreastMin =
    breastFeedings.length > 0
      ? breastFeedings.reduce(
          (sum, r) => sum + (r.breastLeftDurationMin || 0) + (r.breastRightDurationMin || 0),
          0
        ) / breastFeedings.length
      : 0;

  const totalPee = rows.filter((r) => r.pee).length;
  const totalPoop = rows.filter((r) => r.poop).length;
  const feedingsPerDay = days > 0 ? totalFeedings / days : 0;
  const peePerDay = days > 0 ? totalPee / days : 0;
  const poopPerDay = days > 0 ? totalPoop / days : 0;

  // Chart breakdown — hourly for 24h, 6-hourly for 3d, daily otherwise
  let interval: "hour" | "6hour" | "day";
  let breakdown: ({ date: string } & Bucket)[];

  if (days === 1) {
    interval = "hour";
    const now = new Date();
    const cutoffMs = now.getTime() - 24 * 3600 * 1000;
    const hourlyMap: Record<string, Bucket> = {};
    const orderedKeys: string[] = [];

    for (let i = 23; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 3600 * 1000);
      const key = `${d.toISOString().split("T")[0]}T${String(d.getHours()).padStart(2, "0")}`;
      hourlyMap[key] = emptyBucket();
      orderedKeys.push(key);
    }

    for (const row of rows) {
      const rowMs = new Date(`${row.entryDate}T${row.entryTime}`).getTime();
      if (rowMs < cutoffMs) continue;
      const rowHour = new Date(rowMs).getHours();
      const rowDate = row.entryDate;
      const key = `${rowDate}T${String(rowHour).padStart(2, "0")}`;
      if (hourlyMap[key]) accumulate(hourlyMap[key], row);
    }

    breakdown = orderedKeys.map((key) => ({ date: key, ...hourlyMap[key] }));
  } else if (days === 3) {
    interval = "6hour";
    const now = new Date();
    const cutoffMs = now.getTime() - 3 * 24 * 3600 * 1000;
    const sixHourMap: Record<string, Bucket> = {};
    const orderedKeys: string[] = [];

    // 12 buckets: 4 per day × 3 days, oldest first
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 6 * 3600 * 1000);
      const bucketHour = Math.floor(d.getHours() / 6) * 6;
      const key = `${d.toISOString().split("T")[0]}T${String(bucketHour).padStart(2, "0")}`;
      if (!sixHourMap[key]) {
        sixHourMap[key] = emptyBucket();
        orderedKeys.push(key);
      }
    }

    for (const row of rows) {
      const rowMs = new Date(`${row.entryDate}T${row.entryTime}`).getTime();
      if (rowMs < cutoffMs) continue;
      const rowHour = new Date(rowMs).getHours();
      const bucketHour = Math.floor(rowHour / 6) * 6;
      const key = `${row.entryDate}T${String(bucketHour).padStart(2, "0")}`;
      if (sixHourMap[key]) accumulate(sixHourMap[key], row);
    }

    breakdown = orderedKeys.map((key) => ({ date: key, ...sixHourMap[key] }));
  } else {
    interval = "day";
    const dailyMap: Record<string, Bucket> = {};

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      dailyMap[key] = emptyBucket();
    }

    for (const row of rows) {
      const key = row.entryDate;
      if (dailyMap[key]) accumulate(dailyMap[key], row);
    }

    breakdown = Object.entries(dailyMap).map(([date, data]) => ({ date, ...data }));
  }

  return NextResponse.json({
    days,
    interval,
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
    daily: breakdown,
  });
}
