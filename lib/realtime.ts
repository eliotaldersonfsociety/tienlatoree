import { db } from "@/lib/db";
import { behavior } from "@/lib/schema";
import { addEvent } from "@/lib/shared-events";
import { aggregate } from "@/lib/realtime-aggregate";

// ─────────────────────────────────────────────
// Process realtime event (shared logic)
export async function processRealtimeEvent(data: any) {
  // 1️⃣ Add to shared events for testimonials
  addEvent(data);

  // 2️⃣ Aggregate behavior
  if (data.type === "behavior" || data.type === "click") {
    aggregate.scrollSum += data.scroll ?? 0;
    aggregate.events++;
    aggregate.clicks += data.clicks ? 1 : 0;
    aggregate.ctaSeen += data.ctaSeen ?? 0;
    aggregate.converted += data.converted ?? 0;
    aggregate.dirty = true;
  }

  // 3️⃣ Flush each 24h ONLY if dirty
  const ONE_DAY = 1000 * 60 * 60 * 24;
  const now = Date.now();

  if (aggregate.dirty && now - aggregate.lastFlush > ONE_DAY) {
    await db.insert(behavior).values({
      scroll: aggregate.scrollSum / aggregate.events,
      time: aggregate.events,
      clicks: aggregate.clicks,
      ctaSeen: aggregate.ctaSeen,
      converted: aggregate.converted,
    });

    Object.assign(aggregate, {
      scrollSum: 0,
      events: 0,
      clicks: 0,
      ctaSeen: 0,
      converted: 0,
      lastFlush: now,
      dirty: false,
    });

    console.log("💾 Behavior guardado (24h flush)");
  }
}