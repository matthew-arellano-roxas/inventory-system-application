export function cleanQuery<T extends Record<string, unknown>>(
  obj: T,
): Partial<T> {
  // Removes undefined/null and empty-string (optional)
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== undefined && v !== null && v !== "",
    ),
  ) as Partial<T>;
}
