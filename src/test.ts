import { formatJalali, parseJalali, toJalali } from ".";

const jalali = toJalali(new Date()); // { year: 1404, month: 7, ... }
console.log(formatJalali(jalali, "jD jMMM jYYYY, jDo jQo")); // "۲۵ مه ۱۴۰۴، ۲۵ام اول"
console.log(formatJalali(jalali, "HH:mm a")); // "۲۱:۴۵ ق.ظ"

const parsed = parseJalali("۲۵ مهر ۱۴۰۴", "DD MMMM YYYY");
console.log(parsed); // { year: 1404, month: 7, day: 25, ... } (اگر معتبر)
