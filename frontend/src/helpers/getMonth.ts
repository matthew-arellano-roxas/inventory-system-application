export function getMonth(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
  }).format(date);
}
