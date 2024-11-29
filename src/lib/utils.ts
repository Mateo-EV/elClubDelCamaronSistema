import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatId(id: number) {
  let numberStr = Math.floor(id).toString();

  while (numberStr.length < 6) {
    numberStr = "0" + numberStr;
  }

  return "U" + numberStr;
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
