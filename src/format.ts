import { JalaliDateParts } from "./types";
import { fromJalali } from "./converter";
import { toLatinDigits, toPersianNum } from "./utils";
import { isValidJalali } from "./validate";

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
const JALALI_MONTHS_SHORT = [
  "فرو",
  "ارد",
  "خرد",
  "تیر",
  "مرد",
  "شهر",
  "مه",
  "آبا",
  "آذر",
  "دی",
  "بهم",
  "اسف",
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
const JALALI_QUARTERS = ["اول", "دوم", "سوم", "چهارم"];
const JALALI_ORINAL_SUFFIXES = Array(31).fill("ام");

// Token map for formatting (advanced tokens: jMMM, jDo, jQo, jWo, 12-hour time, Z)
const TOKEN_MAP: { [key: string]: (parts: JalaliDateParts) => string } = {
  jMMMM: (parts) => JALALI_MONTHS[parts.month - 1],
  jMMM: (parts) => JALALI_MONTHS_SHORT[parts.month - 1],
  jW: (parts) => JALALI_WEEKDAYS[parts.weekday],
  jYYYY: (parts) => String(parts.year),
  jYY: (parts) => String(parts.year).slice(-2),
  jMM: (parts) => String(parts.month).padStart(2, "0"),
  jM: (parts) => String(parts.month),
  jDD: (parts) => String(parts.day).padStart(2, "0"),
  jD: (parts) => String(parts.day),
  jDo: (parts) => String(parts.day) + JALALI_ORINAL_SUFFIXES[parts.day - 1],
  jQo: (parts) => JALALI_QUARTERS[Math.floor((parts.month - 1) / 3)],
  jWo: (parts) => {
    const { year, month, day } = parts;
    const date = fromJalali(year, month, day);
    const startYear = fromJalali(year, 1, 1);
    const weekNum =
      Math.ceil(
        (date.getTime() - startYear.getTime()) / (7 * 24 * 60 * 60 * 1000)
      ) + 1;
    return String(weekNum) + "ام";
  },
  HH: (parts) => String(parts.hour).padStart(2, "0"),
  H: (parts) => String(parts.hour),
  hh: (parts) => String(parts.hour % 12 || 12).padStart(2, "0"),
  h: (parts) => String(parts.hour % 12 || 12),
  A: (parts) => (parts.hour >= 12 ? "بعدازظهر" : "قبلازظهر"),
  a: (parts) => (parts.hour >= 12 ? "ب.ظ" : "ق.ظ"),
  mm: (parts) => String(parts.minute).padStart(2, "0"),
  m: (parts) => String(parts.minute),
  ss: (parts) => String(parts.second).padStart(2, "0"),
  s: (parts) => String(parts.second),
  Z: () => {
    const offset = -new Date().getTimezoneOffset();
    const sign = offset >= 0 ? "+" : "-";
    const abs = Math.abs(offset);
    return (
      sign +
      String(Math.floor(abs / 60)).padStart(2, "0") +
      ":" +
      String(abs % 60).padStart(2, "0")
    );
  },
};

const SORTED_TOKENS = Object.keys(TOKEN_MAP).sort(
  (a, b) => b.length - a.length
);

// Union of all supported tokens for type safety
type FormatToken =
  | "jYYYY"
  | "jYY"
  | "jMM"
  | "jM"
  | "jDD"
  | "jD"
  | "jDo"
  | "jMMMM"
  | "jMMM"
  | "jW"
  | "jQo"
  | "jWo"
  | "HH"
  | "H"
  | "hh"
  | "h"
  | "A"
  | "a"
  | "mm"
  | "m"
  | "ss"
  | "s"
  | "Z";

// Helper for better autocomplete (avoids type widening)
type LiteralUnion<T extends string> = T | (T & {});

// Template literal type for format strings (combines strings with tokens for autocomplete and validation)
type FormatString = `${string | LiteralUnion<FormatToken>}`;

// Advanced formatting function with token replacement (typed for autocomplete)
export function formatJalali(
  parts: JalaliDateParts,
  formatStr: FormatString,
  usePersian: boolean = true
): string {
  let formatted = formatStr;
  for (const token of SORTED_TOKENS) {
    const replacer = TOKEN_MAP[token as keyof typeof TOKEN_MAP];
    if (typeof replacer === "function") {
      formatted = formatted.replace(new RegExp(token, "g"), replacer(parts));
    }
  }
  return usePersian ? toPersianNum(formatted) : formatted;
}

// Parsing from string to JalaliDateParts (supports names and Persian digits)
export function parseJalali(
  input: string,
  formatStr: FormatString
): JalaliDateParts | null {
  const latinInput = toLatinDigits(input);
  let year = 0,
    month = 0,
    day = 0;

  // Extract month name first
  for (let i = 0; i < JALALI_MONTHS.length; i++) {
    if (
      input.includes(JALALI_MONTHS[i]) ||
      input.includes(JALALI_MONTHS_SHORT[i])
    ) {
      month = i + 1;
      break;
    }
  }

  // Extract numbers
  const numMatches = latinInput.match(/\d{1,4}/g) || [];
  if (numMatches.length >= 3) {
    // Format DD MM YYYY: day=first, month=second (override if name found), year=third
    day = parseInt(numMatches[0]!, 10);
    if (month === 0) month = parseInt(numMatches[1], 10);
    year = parseInt(numMatches[2], 10);
  } else if (numMatches.length === 2 && month > 0) {
    // Format DD MMMM YYYY: day=first, year=second (month from name)
    day = parseInt(numMatches[0], 10);
    year = parseInt(numMatches[1], 10);
  } else if (numMatches.length === 1) {
    // Format YYYY: year=only, day/month default or from format
    year = parseInt(numMatches[0], 10);
  }

  if (!isValidJalali(year, month, day)) return null;

  return { year, month, day, weekday: 0, hour: 0, minute: 0, second: 0 };
}
