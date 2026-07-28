const MS_PER_DAY = 1000 * 60 * 60 * 24;

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

/** Whole days between today and an ISO date (yyyy-mm-dd). Negative = in the past. */
export const daysUntil = (iso: string, now: Date = new Date()) =>
  Math.round((startOfDay(new Date(iso)).getTime() - startOfDay(now).getTime()) / MS_PER_DAY);

export const isPast = (iso: string, now: Date = new Date()) => daysUntil(iso, now) < 0;

/** "4 aug" */
export const formatShortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("nl-NL", { day: "numeric", month: "short" });

/** "za 22 augustus 2026" */
export const formatLongDate = (iso: string) =>
  new Date(iso).toLocaleDateString("nl-NL", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

/** "augustus 2026" — used for month grouping headers. */
export const formatMonthLabel = (iso: string) =>
  new Date(iso).toLocaleDateString("nl-NL", { month: "long", year: "numeric" });

export const monthKey = (iso: string) => iso.slice(0, 7);

/** Relative countdown copy, e.g. "Nog 25 dagen". */
export const countdownLabel = (iso: string) => {
  const d = daysUntil(iso);
  if (d < 0) return "Afgelopen";
  if (d === 0) return "Vandaag";
  if (d === 1) return "Morgen";
  return `Nog ${d} dagen`;
};