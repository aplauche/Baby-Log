import { db } from "./index";
import { entries } from "./schema";

(async () => {
  await db.delete(entries);
  console.log("All entries deleted.");
})();
