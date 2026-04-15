import { db } from "./index";
import { entries } from "./schema";

const DAYS = 7;

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function dateStr(daysAgo: number) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split("T")[0];
}

function timeStr(hour: number, minute = 0) {
  return `${pad(hour)}:${pad(minute)}`;
}

// Build ~7 days of realistic infant feeding + diaper data
const rows: (typeof entries.$inferInsert)[] = [];

for (let day = DAYS - 1; day >= 0; day--) {
  const date = dateStr(day);

  // Feedings: every ~2.5 hours, starting ~6am
  const feedingHours = [6, 9, 12, 15, 18, 21, 0, 3];

  feedingHours.forEach((hour, i) => {
    const minute = Math.floor(Math.random() * 20);
    const isBottle = i % 3 === 0;
    // Alternate: left only, right only, or both
    const sidePattern = i % 3;

    rows.push({
      entryDate: date,
      entryTime: timeStr(hour, minute),
      foodType: isBottle ? "bottle" : "breast",
      bottleAmountMl: isBottle ? 90 + Math.round(Math.random() * 60) : null,
      breastLeftDurationMin: !isBottle && sidePattern !== 2
        ? 8 + Math.round(Math.random() * 8)
        : null,
      breastRightDurationMin: !isBottle && sidePattern !== 1
        ? 8 + Math.round(Math.random() * 8)
        : null,
      pee: Math.random() > 0.2,
      poop: Math.random() > 0.65,
      comments: null,
    });
  });
}

(async () => {
  await db.insert(entries).values(rows);
  console.log(`Seeded ${rows.length} entries across ${DAYS} days.`);
})();
