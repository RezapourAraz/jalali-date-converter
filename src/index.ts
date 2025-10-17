import { gregorianToJalali, jalaliToGregorian } from "./converter";
import { JalaliDateParts } from "./types";

const PERSIAN_NUMBERS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
const JALALI_MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];
const JALALI_WEEKDAYS = [
  "شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنج‌شنبه",
  "جمعه",
];
const J_DAYS_IN_MONTH = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];

function toPersianNum(input: string | number): string {
  const str = String(input);
  return str.replace(/[0-9]/g, (w) => PERSIAN_NUMBERS[+w]);
}

function leapDays(jy: number): number {
  return Math.floor(jy / 33) * 8 + Math.floor(((jy % 33) + 3) / 4);
}

export function isJalaliLeapYear(year: number): boolean {
  const jy = year - 979;
  const leap_current = leapDays(jy);
  const leap_next = leapDays(jy + 1);
  return leap_next - leap_current === 1;
}

export function isValidJalali(
  year: number,
  month: number,
  day: number
): boolean {
  if (year < 1 || month < 1 || month > 12 || day < 1 || day > 31) return false;
  const daysInMonth = J_DAYS_IN_MONTH[month - 1];
  const isLeap = isJalaliLeapYear(year);
  if (month === 12 && isLeap) return day <= 30;
  return day <= daysInMonth;
}

export function daysInJalaliMonth(year: number, month: number): number {
  if (month < 1 || month > 12) return 0;
  if (month <= 6) return 31;
  if (month < 12) return 30;
  return isJalaliLeapYear(year) ? 30 : 29;
}

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

export function addToJalali(
  parts: JalaliDateParts,
  {
    days = 0,
    months = 0,
    years = 0,
  }: { days?: number; months?: number; years?: number }
): JalaliDateParts {
  const date = fromJalali(parts.year, parts.month, parts.day);
  const newDate = new Date(date);
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

export function subtractFromJalali(
  parts: JalaliDateParts,
  {
    days = 0,
    months = 0,
    years = 0,
  }: { days?: number; months?: number; years?: number }
): JalaliDateParts {
  return addToJalali(parts, { days: -days, months: -months, years: -years });
}

export function differenceInDays(
  parts1: JalaliDateParts,
  parts2: JalaliDateParts
): number {
  const date1 = fromJalali(parts1.year, parts1.month, parts1.day);
  const date2 = fromJalali(parts2.year, parts2.month, parts2.day);
  const diffTime = Math.abs(date1.getTime() - date2.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function differenceInMonths(
  parts1: JalaliDateParts,
  parts2: JalaliDateParts
): number {
  const date1 = fromJalali(parts1.year, parts1.month, parts1.day);
  const date2 = fromJalali(parts2.year, parts2.month, parts2.day);
  const months1 = date1.getFullYear() * 12 + date1.getMonth();
  const months2 = date2.getFullYear() * 12 + date2.getMonth();
  return Math.abs(months1 - months2);
}

export function isBefore(
  parts1: JalaliDateParts,
  parts2: JalaliDateParts
): boolean {
  const date1 = fromJalali(parts1.year, parts1.month, parts1.day);
  const date2 = fromJalali(parts2.year, parts2.month, parts2.day);
  return date1 < date2;
}

export function isAfter(
  parts1: JalaliDateParts,
  parts2: JalaliDateParts
): boolean {
  const date1 = fromJalali(parts1.year, parts1.month, parts1.day);
  const date2 = fromJalali(parts2.year, parts2.month, parts2.day);
  return date1 > date2;
}

export function isSameDay(
  parts1: JalaliDateParts,
  parts2: JalaliDateParts
): boolean {
  const date1 = fromJalali(parts1.year, parts1.month, parts1.day);
  const date2 = fromJalali(parts2.year, parts2.month, parts2.day);
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function toJalali(date: Date): JalaliDateParts {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error("Input must be a valid Date object.");
  }

  const gy = date.getFullYear();
  const gm = date.getMonth() + 1;
  const gd = date.getDate();

  const { jYear, jMonth, jDay } = gregorianToJalali(gy, gm, gd);

  const jalaliWeekday = (date.getDay() + 1) % 7;

  return {
    year: jYear,
    month: jMonth,
    day: jDay,
    weekday: jalaliWeekday,
    hour: date.getHours(),
    minute: date.getMinutes(),
    second: date.getSeconds(),
  };
}

export function fromJalali(year: number, month: number, day: number): Date {
  const { gYear, gMonth, gDay } = jalaliToGregorian(year, month, day);
  return new Date(gYear, gMonth - 1, gDay);
}

export function formatJalali(
  dateParts: JalaliDateParts,
  formatString: string,
  usePersianNumbers: boolean = true
): string {
  const { year, month, day, weekday, hour, minute, second } = dateParts;

  const tokenMap = new Map<string, () => string>([
    ["jMMMM", () => JALALI_MONTHS[month - 1]],
    ["jW", () => JALALI_WEEKDAYS[weekday]],
    ["jYYYY", () => String(year)],
    ["jYY", () => String(year).slice(-2)],
    ["jMM", () => String(month).padStart(2, "0")],
    ["jM", () => String(month)],
    ["jDD", () => String(day).padStart(2, "0")],
    ["jD", () => String(day)],
    ["HH", () => String(hour).padStart(2, "0")],
    ["mm", () => String(minute).padStart(2, "0")],
    ["ss", () => String(second).padStart(2, "0")],
  ]);

  let formatted = formatString;

  const sortedTokens = Array.from(tokenMap.keys()).sort(
    (a, b) => b.length - a.length
  );

  for (const token of sortedTokens) {
    const regex = new RegExp(token, "g");
    formatted = formatted.replace(regex, tokenMap.get(token)!());
  }

  if (usePersianNumbers) {
    formatted = toPersianNum(formatted);
  }

  return formatted;
}

export default {
  toJalali,
  fromJalali,
  formatJalali,
  addToJalali,
  subtractFromJalali,
  differenceInDays,
  differenceInMonths,
  isBefore,
  isAfter,
  isSameDay,
  isValidJalali,
  isJalaliLeapYear,
  daysInJalaliMonth,
  startOfJalaliMonth,
  endOfJalaliMonth,
};
