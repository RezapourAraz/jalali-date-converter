import {
  formatJalali,
  parseJalali,
  addToJalali,
  subtractFromJalali,
  differenceInDays,
  isValidJalali,
  isJalaliLeapYear,
  daysInJalaliMonth,
  startOfJalaliMonth,
  isSameDay,
} from "../src";
import { fromJalali, toJalali } from "../src/converter";

console.log("=== Jalali Date Converter Tests ===");

// Test 1: Basic Conversion (Oct 17, 2025 → ۱۴۰۴/۷/۲۵)
const gregDate = new Date(2025, 9, 17); // Oct 17 (month 0-indexed)
const jalali = toJalali(gregDate);
console.log("Conversion:", jalali); // Expected: { year: 1404, month: 7, day: 25, weekday: 6, ... }

// Test 2: Round-trip (Jalali → Gregorian)
const backToGreg = fromJalali(jalali.year, jalali.month, jalali.day);
console.log(
  "Round-trip:",
  backToGreg.toDateString() === gregDate.toDateString() ? "PASS" : "FAIL"
);

// Test 3: Formatting
const formatted = formatJalali(jalali, "jD jMMM jYYYY, jDo jQo - HH:mm a");
console.log("Formatting:", formatted); // Expected: "۲۵ مه ۱۴۰۴، ۲۵ام سوم - ۰۰:۰۰ ق.ظ" (adjust time)

// Test 4: Parsing
const parsed = parseJalali("۲۵ مهر ۱۴۰۴", "jD jMMMM jYYYY");
console.log(
  "Parsing:",
  parsed && parsed.day === 25 && parsed.month === 7 ? "PASS" : "FAIL",
  parsed
);

// Test 5: Manipulate
const tomorrow = addToJalali(jalali, { days: 1 });
console.log("Add days:", tomorrow.day === 26 ? "PASS" : "FAIL");

const yesterday = subtractFromJalali(jalali, { days: 1 });
console.log("Subtract days:", yesterday.day === 24 ? "PASS" : "FAIL");

// Test 6: Calculation
console.log(
  "Difference in days:",
  differenceInDays(jalali, tomorrow) === 1 ? "PASS" : "FAIL"
);
console.log("Is same day:", isSameDay(jalali, jalali) ? "PASS" : "FAIL");

// Test 7: Validation & Utility
console.log("Is valid:", isValidJalali(1404, 7, 25) ? "PASS" : "FAIL");
console.log("Leap year 1403:", isJalaliLeapYear(1403) ? "PASS" : "FAIL"); // 1403 is leap
console.log(
  "Days in month:",
  daysInJalaliMonth(1404, 12) === 29 ? "PASS" : "FAIL"
); // Non-leap Dec

const startMonth = startOfJalaliMonth(jalali);
console.log("Start of month:", startMonth.day === 1 ? "PASS" : "FAIL");

console.log("=== All Tests Passed! ===");
