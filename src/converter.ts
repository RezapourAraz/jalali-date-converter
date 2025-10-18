import { GregorianParts, JalaliDateParts, JalaliMathParts } from "./types";

const G_DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const J_DAYS_IN_MONTH = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];

function isGregorianLeap(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

// Main conversion functions
export function gregorianToJalali(
  gy: number,
  gm: number,
  gd: number
): JalaliMathParts {
  let g_day_no =
    365 * (gy - 1600) +
    Math.floor((gy - 1597) / 4) -
    Math.floor((gy - 1601) / 100) +
    Math.floor((gy - 1601) / 400);
  gm -= 1;
  gd -= 1;
  for (let i = 0; i < gm; ++i) g_day_no += G_DAYS_IN_MONTH[i];
  if (gm > 1 && isGregorianLeap(gy)) g_day_no++;
  g_day_no += gd;

  let j_day_no = g_day_no - 79;
  let j_np = Math.floor(j_day_no / 12053);
  j_day_no %= 12053;
  let jy = 979 + 33 * j_np + 4 * Math.floor(j_day_no / 1461);
  j_day_no %= 1461;
  if (j_day_no >= 366) {
    jy += Math.floor((j_day_no - 1) / 365);
    j_day_no = (j_day_no - 1) % 365;
  }

  let i = 0;
  while (i < 11 && j_day_no >= J_DAYS_IN_MONTH[i]) {
    j_day_no -= J_DAYS_IN_MONTH[i];
    i++;
  }

  return { jYear: jy, jMonth: i + 1, jDay: j_day_no + 1 };
}

export function jalaliToGregorian(
  jy: number,
  jm: number,
  jd: number
): GregorianParts {
  let j_day_no =
    365 * (jy - 979) +
    Math.floor((jy - 979) / 33) * 8 +
    Math.floor((((jy - 979) % 33) + 3) / 4);
  for (let i = 0; i < jm - 1; ++i) j_day_no += J_DAYS_IN_MONTH[i];
  j_day_no += jd - 1;

  let g_day_no = j_day_no + 79;
  let gy = 1600 + 400 * Math.floor(g_day_no / 146097);
  g_day_no %= 146097;
  if (g_day_no >= 36525) {
    g_day_no--;
    gy += 100 * Math.floor(g_day_no / 36524);
    g_day_no %= 36524;
    if (g_day_no >= 365) g_day_no++;
  }
  gy += 4 * Math.floor(g_day_no / 1461);
  g_day_no %= 1461;
  if (g_day_no >= 366) {
    g_day_no--;
    gy += Math.floor(g_day_no / 365);
    g_day_no %= 365;
  }

  let i = 0;
  while (
    i < 12 &&
    g_day_no >= G_DAYS_IN_MONTH[i] + +(i === 1 && isGregorianLeap(gy))
  ) {
    g_day_no -= G_DAYS_IN_MONTH[i] + +(i === 1 && isGregorianLeap(gy));
    i++;
  }

  return { gYear: gy, gMonth: i + 1, gDay: g_day_no + 1 };
}

// Convenience wrappers for Date objects
export function toJalali(date: Date): JalaliDateParts {
  if (!(date instanceof Date) || isNaN(date.getTime()))
    throw new Error("Invalid Date");
  const gy = date.getFullYear(),
    gm = date.getMonth() + 1,
    gd = date.getDate();
  const { jYear, jMonth, jDay } = gregorianToJalali(gy, gm, gd);
  const weekday = (date.getDay() + 1) % 7;
  return {
    year: jYear,
    month: jMonth,
    day: jDay,
    weekday,
    hour: date.getHours(),
    minute: date.getMinutes(),
    second: date.getSeconds(),
  };
}

export function fromJalali(year: number, month: number, day: number): Date {
  const { gYear, gMonth, gDay } = jalaliToGregorian(year, month, day);
  return new Date(gYear, gMonth - 1, gDay);
}
