import { JalaliDateParts } from "./types";
import { fromJalali, toJalali } from "./converter";
import { leapDays } from "./utils";

export function isJalaliLeapYear(year: number): boolean {
  const jy = year - 979;
  return leapDays(jy + 1) - leapDays(jy) === 1;
}

// Validate Jalali date components
export function isValidJalali(
  year: number,
  month: number,
  day: number
): boolean {
  if (year < 1 || month < 1 || month > 12 || day < 1 || day > 31) return false;
  const maxDays =
    month <= 6 ? 31 : month < 12 ? 30 : isJalaliLeapYear(year) ? 30 : 29;
  return day <= maxDays;
}

export function daysInJalaliMonth(year: number, month: number): number {
  if (month < 1 || month > 12) return 0;
  return month <= 6 ? 31 : month < 12 ? 30 : isJalaliLeapYear(year) ? 30 : 29;
}

// Utility for month boundaries
export function startOfJalaliMonth(parts: JalaliDateParts): JalaliDateParts {
  const date = fromJalali(parts.year, parts.month, 1);
  const newParts = toJalali(date);
  return {
    ...newParts,
    hour: parts.hour,
    minute: parts.minute,
    second: parts.second,
  };
}

export function endOfJalaliMonth(parts: JalaliDateParts): JalaliDateParts {
  const days = daysInJalaliMonth(parts.year, parts.month);
  const date = fromJalali(parts.year, parts.month, days);
  const newParts = toJalali(date);
  return {
    ...newParts,
    hour: parts.hour,
    minute: parts.minute,
    second: parts.second,
  };
}
