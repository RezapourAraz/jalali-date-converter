````markdown
# Jalali Date Converter

پکیج ساده و قدرتمند برای تبدیل تاریخ میلادی (Gregorian) به شمسی (Jalali) و بالعکس، با قابلیت‌های فرمتینگ فارسی، محاسبات، و validation. این پکیج بر اساس الگوریتم استاندارد Jalali نوشته شده و کاملاً bidirectional (round-trip) کار می‌کنه. مناسب برای اپ‌های وب، موبایل، و سرور که با کاربران فارسی‌زبان کار می‌کنن.

## ویژگی‌ها

- **تبدیل تاریخ:** از Date JS به JalaliDateParts و بالعکس.
- **فرمتینگ پیشرفته:** با token‌های فارسی مثل `jD jMMMM jYYYY` (۲۵ مهر ۱۴۰۴).
- **Manipulate:** اضافه/کم کردن روز، ماه، سال.
- **محاسبات:** تفاوت روز/ماه، مقایسه (isBefore, isSameDay).
- **Validation:** چک معتبر بودن تاریخ شمسی (با کبیسه).
- **Utility:** اول/آخر ماه، تعداد روزهای ماه.
- **پشتیبانی از اعداد فارسی:** خودکار تبدیل ۰-۹ به ۰-۹.
- **TypeScript:** کامل typed با autocomplete برای tokens.

## نصب

```bash
npm install jalali-date-converter
```
````

### Dependencies

- TypeScript (dev): ^5.0.0
- Node.js: >=14

## استفاده سریع

```typescript
import { toJalali, formatJalali, parseJalali } from "jalali-date-converter";

const now = new Date();
const jalali = toJalali(now); // { year: 1404, month: 8, day: 26, ... }

console.log(formatJalali(jalali, "jD jMMMM jYYYY")); // "۲۶ آبان ۱۴۰۴"

const parsed = parseJalali("۲۶ آبان ۱۴۰۴", "jD jMMMM jYYYY");
console.log(parsed); // { year: 1404, month: 8, day: 26, weekday: 0, hour: 0, ... }
```

## API Reference

### 1. تبدیل تاریخ (Conversion)

- **toJalali(date: Date): JalaliDateParts**

  - ورودی: Date JS (میلادی).
  - خروجی: شی JalaliDateParts (شامل year, month, day, weekday, hour, minute, second).
  - مثال:
    ```typescript
    const jalali = toJalali(new Date(2025, 9, 17)); // Oct 17, 2025 → { year: 1404, month: 7, day: 25, ... }
    ```

- **fromJalali(year: number, month: number, day: number): Date**
  - ورودی: سال، ماه (1-12)، روز شمسی.
  - خروجی: Date JS (میلادی).
  - مثال:
    ```typescript
    const gregDate = fromJalali(1404, 7, 25); // Fri Oct 17 2025
    ```

### 2. فرمتینگ و Parsing

- **formatJalali(parts: JalaliDateParts, formatStr: string, usePersian: boolean = true): string**

  - ورودی: JalaliDateParts، رشته فرمت (با tokens)، گزینه اعداد فارسی.
  - خروجی: رشته فرمت‌شده.
  - Tokens (autocomplete در TS):
    - **سال:** `jYYYY` (۱۴۰۴), `jYY` (۰۴)
    - **ماه:** `jMMMM` (مهر), `jMMM` (مه), `jMM` (۰۷), `jM` (۷)
    - **روز:** `jDD` (۲۵), `jD` (۲۵), `jDo` (۲۵ام)
    - **روز هفته:** `jW` (جمعه)
    - **ربع سال:** `jQo` (سوم)
    - **هفته سال:** `jWo` (۴۲ام)
    - **زمان:** `HH:mm a` (۲۲:۱۷ ب.ظ), `H` (۲۲), `hh` (۱۰), `A` (بعدازظهر), `Z` (+۰۳:۳۰)
  - مثال:
    ```typescript
    formatJalali(jalali, "jD jMMM jYYYY, HH:mm a"); // "۲۵ مه ۱۴۰۴, ۲۲:۱۷ ب.ظ"
    ```

- **parseJalali(input: string, formatStr: string): JalaliDateParts | null**
  - ورودی: رشته (مثل "۲۵ مهر ۱۴۰۴")، فرمت.
  - خروجی: JalaliDateParts (اگر معتبر) یا null.
  - پشتیبانی: نام ماه (مهر), اعداد فارسی/لاتین.
  - مثال:
    ```typescript
    const parsed = parseJalali("۲۵ مهر ۱۴۰۴", "jD jMMMM jYYYY"); // { year: 1404, month: 7, day: 25, ... }
    ```

### 3. Manipulate (تغییر تاریخ)

- **addToJalali(parts: JalaliDateParts, { days?: number, months?: number, years?: number }): JalaliDateParts**

  - اضافه کردن واحدها (زمان حفظ می‌شه).
  - مثال:
    ```typescript
    const tomorrow = addToJalali(jalali, { days: 1 }); // day: 26
    ```

- **subtractFromJalali(parts: JalaliDateParts, { days?: number, months?: number, years?: number }): JalaliDateParts**
  - کم کردن واحدها.
  - مثال:
    ```typescript
    const yesterday = subtractFromJalali(jalali, { days: 1 }); // day: 24
    ```

### 4. محاسبات (Calculations)

- **differenceInDays(p1: JalaliDateParts, p2: JalaliDateParts): number**

  - تفاوت به روز.
  - مثال: `differenceInDays(jalali, tomorrow) // 1`

- **differenceInMonths(p1: JalaliDateParts, p2: JalaliDateParts): number**

  - تفاوت به ماه (تقریبی).

- **isBefore(p1: JalaliDateParts, p2: JalaliDateParts): boolean**

  - p1 قبل از p2؟

- **isAfter(p1: JalaliDateParts, p2: JalaliDateParts): boolean**

  - p1 بعد از p2؟

- **isSameDay(p1: JalaliDateParts, p2: JalaliDateParts): boolean**
  - همان روز؟

### 5. Validation و Utility

- **isValidJalali(year: number, month: number, day: number): boolean**

  - چک معتبر بودن (با کبیسه اسفند).

- **isJalaliLeapYear(year: number): boolean**

  - سال کبیسه؟ (مثل ۱۴۰۳).

- **daysInJalaliMonth(year: number, month: number): number**

  - تعداد روزهای ماه (اسفند: ۲۹/۳۰).

- **startOfJalaliMonth(parts: JalaliDateParts): JalaliDateParts**

  - اول ماه (روز ۱).

- **endOfJalaliMonth(parts: JalaliDateParts): JalaliDateParts**
  - آخر ماه.

## مثال‌های کامل

### Round-trip Conversion

```typescript
import { toJalali, fromJalali } from "jalali-date-converter";

const greg = new Date(2025, 9, 17); // 17 Oct 2025
const jal = toJalali(greg); // { year: 1404, month: 7, day: 25, ... }
const back = fromJalali(jal.year, jal.month, jal.day); // همان greg
console.log(back.toDateString() === greg.toDateString()); // true
```

### فرمتینگ با زمان

```typescript
const formatted = formatJalali(jalali, "امروز jW، jD jMMMM jYYYY ساعت HH:mm");
// "امروز جمعه، ۲۵ مهر ۱۴۰۴ ساعت ۲۲:۱۷"
```

### Parsing + Manipulate

```typescript
const parsed = parseJalali("۲۵ مهر ۱۴۰۴", "jD jMMMM jYYYY");
if (parsed) {
  const nextWeek = addToJalali(parsed, { days: 7 });
  console.log(formatJalali(nextWeek, "jD jMMMM")); // "۱ آبان"
}
```

## نکات مهم

- **کبیسه:** بر اساس چرخه ۳۳ ساله شمسی (دقیق برای سال‌های ۹۷۹-۳۳۲۲).
- **Timezone:** فرمت Z بر اساس محلی (ایران +۰۳:۳۰).
- **اعداد فارسی:** usePersian=true برای ۰-۹، false برای 0-9.
- **خطاها:** Invalid Date → throw Error. Invalid Jalali → null در parse.
- **Performance:** برای ۱۰۰۰+ فراخوانی، TOKEN_MAP cached هست.

## License

MIT License – آزاد برای استفاده تجاری/غیرتجاری.

## Contribute

Pull requests خوشحال‌کننده! Issue باز کن برای باگ/فیچر. سورس: [GitHub Repo](https://github.com/RezapourAraz/jalali-date-converter).

سوال داری؟ [Issues](https://github.com/RezapourAraz/jalali-date-converter/issues) باز کن. 😊

```

```
