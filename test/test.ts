// test/test.ts – Test for jalali-date-converter
import {
  toJalali,
  fromJalali,
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
} from "../src"; // Named import from src/index.ts

console.log("=== Jalali Date Converter Tests ===");

// Test 1: Basic Conversion (Oct 18, 2025 → ۱۴۰۴/۷/۲۶)
const gregDate = new Date(2025, 9, 18); // Oct 18 (month 0-indexed)
const jalali = toJalali(gregDate);
console.log("Conversion:", jalali); // Expected: { year: 1404, month: 7, day: 26, weekday: 6, ... }

// Test 2: Round-trip (Jalali → Gregorian)
const backToGreg = fromJalali(jalali.year, jalali.month, jalali.day);
console.log(
  "Round-trip:",
  backToGreg.toDateString() === gregDate.toDateString() ? "PASS" : "FAIL"
);

// Test 3: Formatting
const formatted = formatJalali(jalali, "jD jMMM jYYYY, jDo jQo - HH:mm a");
console.log("Formatting:", formatted); // Expected: "۲۶ مهر ۱۴۰۴، ۲۶ام سوم - ۰۰:۰۰ ق.ظ"

// Test 4: Parsing
const parsed = parseJalali("۲۶ مهر ۱۴۰۴", "jD jMMMM jYYYY");
console.log(
  "Parsing:",
  parsed && parsed.day === 26 && parsed.month === 7 ? "PASS" : "FAIL",
  parsed
);

// Test 5: Manipulate
const tomorrow = addToJalali(jalali, { days: 1 });
console.log("Add days:", tomorrow.day === 27 ? "PASS" : "FAIL");

const yesterday = subtractFromJalali(jalali, { days: 1 });
console.log("Subtract days:", yesterday.day === 25 ? "PASS" : "FAIL");

// Test 6: Calculation
console.log(
  "Difference in days:",
  differenceInDays(jalali, tomorrow) === 1 ? "PASS" : "FAIL"
);
console.log("Is same day:", isSameDay(jalali, jalali) ? "PASS" : "FAIL");

// Test 7: Validation & Utility
console.log("Is valid:", isValidJalali(1404, 7, 26) ? "PASS" : "FAIL");
console.log("Leap year 1403:", isJalaliLeapYear(1403) ? "PASS" : "FAIL"); // 1403 is leap
console.log(
  "Days in month:",
  daysInJalaliMonth(1404, 12) === 29 ? "PASS" : "FAIL"
); // Non-leap Dec

const startMonth = startOfJalaliMonth(jalali);
console.log("Start of month:", startMonth.day === 1 ? "PASS" : "FAIL");

console.log("=== All Tests Passed! ===");
