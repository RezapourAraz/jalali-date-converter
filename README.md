# Jalali Date Converter

تبدیل و فرمتینگ تاریخ شمسی.

## نصب

npm i jalali-date-converter

## استفاده

```ts
import { toJalali, formatJalali } from "jalali-date-converter";
const jal = toJalali(new Date());
console.log(formatJalali(jal, "jD jMMMM jYYYY")); // ۲۵ مهر ۱۴۰۴
```
