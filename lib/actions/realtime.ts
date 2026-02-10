"use server";

import { processRealtimeEvent } from "@/lib/realtime";

// ─────────────────────────────────────────────
// SERVER ACTION: Send realtime event
export async function sendRealtimeEvent(data: any) {
  await processRealtimeEvent(data);
  return { ok: true };
}