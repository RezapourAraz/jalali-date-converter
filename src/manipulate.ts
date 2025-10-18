import { JalaliDateParts } from "./types";
import { fromJalali, toJalali } from "./converter";

// Add units to Jalali date while preserving time
export function addToJalali(
  parts: JalaliDateParts,
  {
    days = 0,
    months = 0,
    years = 0,
  }: { days?: number; months?: number; years?: number }
): JalaliDateParts {
  const date = fromJalali(parts.year, parts.month, parts.day);
  const newDate = new Date(date.getTime());
  newDate.setFullYear(newDate.getFullYear() + years);
  newDate.setMonth(newDate.getMonth() + months);
  newDate.setDate(newDate.getDate() + days);
  const newParts = toJalali(newDate);
  return {
    ...newParts,
    hour: parts.hour,
    minute: parts.minute,
    second: parts.second,
  };
}

// Subtract units from Jalali date (wrapper for addToJalali)
export function subtractFromJalali(
  parts: JalaliDateParts,
  options: { days?: number; months?: number; years?: number }
): JalaliDateParts {
  return addToJalali(parts, {
    days: -(options.days ?? 0),
    months: -(options.months ?? 0),
    years: -(options.years ?? 0),
  });
}
