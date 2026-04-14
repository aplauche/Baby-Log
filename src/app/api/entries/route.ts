import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { entries } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  const allEntries = await db
    .select()
    .from(entries)
    .orderBy(desc(entries.entryDate), desc(entries.entryTime));

  return NextResponse.json(allEntries);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const newEntry = await db
    .insert(entries)
    .values({
      entryDate: body.entryDate,
      entryTime: body.entryTime,
      foodType: body.foodType || null,
      bottleAmountMl: body.bottleAmountMl || null,
      breastSide: body.breastSide || null,
      breastDurationMin: body.breastDurationMin || null,
      pee: body.pee ?? false,
      poop: body.poop ?? false,
      comments: body.comments || null,
    })
    .returning();

  return NextResponse.json(newEntry[0], { status: 201 });
}
