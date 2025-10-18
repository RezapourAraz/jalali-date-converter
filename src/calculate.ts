import { JalaliDateParts } from "./types";
import { fromJalali } from "./converter";

// Calculate difference in days between two Jalali dates
export function differenceInDays(
  parts1: JalaliDateParts,
  parts2: JalaliDateParts
): number {
  const d1 = fromJalali(parts1.year, parts1.month, parts1.day).getTime();
  const d2 = fromJalali(parts2.year, parts2.month, parts2.day).getTime();
  return Math.ceil(Math.abs(d1 - d2) / (1000 * 60 * 60 * 24));
}

// Calculate difference in months (approximate, based on Gregorian)
export function differenceInMonths(
  parts1: JalaliDateParts,
  parts2: JalaliDateParts
): number {
  const d1 = fromJalali(parts1.year, parts1.month, parts1.day);
  const d2 = fromJalali(parts2.year, parts2.month, parts2.day);
  const m1 = d1.getFullYear() * 12 + d1.getMonth();
  const m2 = d2.getFullYear() * 12 + d2.getMonth();
  return Math.abs(m1 - m2);
}

// Comparison functions
export function isBefore(p1: JalaliDateParts, p2: JalaliDateParts): boolean {
  return (
    fromJalali(p1.year, p1.month, p1.day) <
    fromJalali(p2.year, p2.month, p2.day)
  );
}

export function isAfter(p1: JalaliDateParts, p2: JalaliDateParts): boolean {
  return (
    fromJalali(p1.year, p1.month, p1.day) >
    fromJalali(p2.year, p2.month, p2.day)
  );
}

export function isSameDay(p1: JalaliDateParts, p2: JalaliDateParts): boolean {
  const d1 = fromJalali(p1.year, p1.month, p1.day);
  const d2 = fromJalali(p2.year, p2.month, p2.day);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}
