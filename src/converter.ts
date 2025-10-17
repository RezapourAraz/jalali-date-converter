import { GregorianParts, JalaliMathParts } from "./types";

// gregorian months number of days
const G_DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
// jalali months number of days
const J_DAYS_IN_MONTH = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];

function isGregorianLeap(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function gregorianToJalali(
  gy: number,
  gm: number,
  gd: number
): JalaliMathParts {
  let j_day_no: number, g_day_no: number, j_np: number;
  let i: number;

  gy -= 1600;
  gm -= 1;
  gd -= 1;

  g_day_no =
    365 * gy +
    Math.floor((gy + 3) / 4) -
    Math.floor((gy + 99) / 100) +
    Math.floor((gy + 399) / 400);

  for (i = 0; i < gm; ++i) g_day_no += G_DAYS_IN_MONTH[i]!;
  if (gm > 1 && isGregorianLeap(gy + 1600)) g_day_no++;
  g_day_no += gd;

  j_day_no = g_day_no - 79;

  j_np = Math.floor(j_day_no / 12053);
  j_day_no %= 12053;

  let jy = 979 + 33 * j_np + 4 * Math.floor(j_day_no / 1461);
  j_day_no %= 1461;

  if (j_day_no >= 366) {
    jy += Math.floor((j_day_no - 1) / 365);
    j_day_no = (j_day_no - 1) % 365;
  }

  i = 0;
  while (i < 11 && j_day_no >= J_DAYS_IN_MONTH[i]!) {
    j_day_no -= J_DAYS_IN_MONTH[i]!;
    i++;
  }

  let jMonth = i + 1;
  let jDay = j_day_no + 1;

  return { jYear: jy, jMonth: jMonth, jDay: jDay };
}

export function jalaliToGregorian(
  jy: number,
  jm: number,
  jd: number
): GregorianParts {
  let i: number, j_day_no: number, g_day_no: number;
  let gy: number, gm: number, gd: number;

  jy -= 979;
  j_day_no =
    365 * jy + Math.floor(jy / 33) * 8 + Math.floor(((jy % 33) + 3) / 4);

  for (i = 0; i < jm - 1; ++i) j_day_no += J_DAYS_IN_MONTH[i]!;

  j_day_no += jd - 1;

  g_day_no = j_day_no + 79;

  gy = 1600 + 400 * Math.floor(g_day_no / 146097);
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

  i = 0;
  while (
    i < 12 &&
    g_day_no >= G_DAYS_IN_MONTH[i]! + +(i === 1 && isGregorianLeap(gy))
  ) {
    g_day_no -= G_DAYS_IN_MONTH[i]! + +(i === 1 && isGregorianLeap(gy));
    i++;
  }

  gm = i + 1;
  gd = g_day_no + 1;

  return { gYear: gy, gMonth: gm, gDay: gd };
}
