export function toDecimalPlaces(
  value: number | string,
  numberOfDecimalPlaces: number
): number {
  if (typeof value === "string") value = parseFloat(value);
  return parseFloat(value.toFixed(numberOfDecimalPlaces));
}
