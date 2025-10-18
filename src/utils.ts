const PERSIAN_NUMBERS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
const LATIN_NUMBERS = "0123456789";

export function toPersianNum(input: string | number): string {
  return String(input).replace(/\d/g, (d) => PERSIAN_NUMBERS[parseInt(d)]);
}

export function toLatinDigits(input: string): string {
  return input.replace(
    new RegExp(`[${PERSIAN_NUMBERS.join("")}]`, "g"),
    (w) => LATIN_NUMBERS[PERSIAN_NUMBERS.indexOf(w)]
  );
}

export function leapDays(jy: number): number {
  return Math.floor(jy / 33) * 8 + Math.floor(((jy % 33) + 3) / 4);
}
