import "server-only";

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
