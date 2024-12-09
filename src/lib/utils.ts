import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatId(id: number, char = "U") {
  let numberStr = Math.floor(id).toString();

  while (numberStr.length < 6) {
    numberStr = "0" + numberStr;
  }

  return char + numberStr;
}

export function unformatId(code: string) {
  if (code.length !== 7) {
    return null;
  }

  if (code.startsWith("U") || code.startsWith("u")) {
    const numberPart = code.slice(1);

    return parseInt(numberPart);
  }

  return null;
}

const CURRENCY_FORMAT = Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
});

export function formatPrice(price: number | bigint) {
  return CURRENCY_FORMAT.format(price);
}

const DATE_FORMAT = new Intl.DateTimeFormat("es-PE", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

export function formatDate(date: Date) {
  return DATE_FORMAT.format(date);
}

export function getTodayFilters() {
  const today = new Date();
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1,
  );

  return { gte: startOfDay, lt: endOfDay };
}
