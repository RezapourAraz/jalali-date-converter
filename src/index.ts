// src/index.ts – Barrel file with explicit imports to fix scope
import {
  gregorianToJalali,
  jalaliToGregorian,
  toJalali,
  fromJalali,
} from "./converter";
import { addToJalali, subtractFromJalali } from "./manipulate";
import {
  differenceInDays,
  differenceInMonths,
  isBefore,
  isAfter,
  isSameDay,
} from "./calculate";
import {
  isValidJalali,
  isJalaliLeapYear,
  daysInJalaliMonth,
  startOfJalaliMonth,
  endOfJalaliMonth,
} from "./validate";
import { formatJalali, parseJalali } from "./format";

export {
  gregorianToJalali,
  jalaliToGregorian,
  toJalali,
  fromJalali,
} from "./converter";
export { addToJalali, subtractFromJalali } from "./manipulate";
export {
  differenceInDays,
  differenceInMonths,
  isBefore,
  isAfter,
  isSameDay,
} from "./calculate";
export {
  isValidJalali,
  isJalaliLeapYear,
  daysInJalaliMonth,
  startOfJalaliMonth,
  endOfJalaliMonth,
} from "./validate";
export { formatJalali, parseJalali } from "./format";

export * from "./types";

// Default export – shorthand now works with imports in scope
export default {
  toJalali,
  fromJalali,
  formatJalali,
  parseJalali,
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
