// ─────────────────────────────────────────────
// IN-MEMORY AGGREGATE (shared between API and actions)
export const aggregate = {
  scrollSum: 0,
  events: 0,
  clicks: 0,
  ctaSeen: 0,
  converted: 0,
  lastFlush: Date.now(),
  dirty: false,
};