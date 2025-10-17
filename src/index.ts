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

function toPersianNum(input: string | number): string {
  const str = String(input);
  return str.replace(/[0-9]/g, (w) => PERSIAN_NUMBERS[+w]);
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
};
