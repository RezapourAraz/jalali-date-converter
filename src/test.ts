import {
  toJalali,
  fromJalali,
  formatJalali,
  addToJalali,
  differenceInDays,
  isSameDay,
} from "./index";

const now = new Date();
console.log(`✅ Gregorian Date ${now.toUTCString()}`);

const jalaliParts = toJalali(now);
console.log("Jalali date object : ", jalaliParts);

const persianFormatted = formatJalali(
  jalaliParts,
  "امروز jW، jD jMMMM jYYYY - ساعت HH:mm"
);
console.log("Persian format with persian numeric : ", persianFormatted);

const testJalaliYear = 1404;
const testJalaliMonth = 7;
const testJalaliDay = 25;

const backToGregorian = fromJalali(
  testJalaliYear,
  testJalaliMonth,
  testJalaliDay
);
console.log("Jalali to Gregorian : ");
console.log(
  `${testJalaliYear}/${testJalaliMonth}/${testJalaliDay} Jalali equal to Gregorian : ${backToGregorian.toDateString()}`
);

const nowJalali = toJalali(new Date());
const tomorrow = addToJalali(nowJalali, { days: 1 });
console.log(differenceInDays(nowJalali, tomorrow));
console.log(isSameDay(nowJalali, nowJalali));
