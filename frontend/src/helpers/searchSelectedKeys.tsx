export type SearchPrimitive =
  | string
  | number
  | boolean
  | bigint
  | Date
  | null
  | undefined;

export type SearchableKeys<T> = {
  [K in keyof T]-?: T[K] extends SearchPrimitive ? K : never;
}[keyof T];

function toSearchString(value: SearchPrimitive): string {
  if (value === null || value === undefined) return "";
  return value instanceof Date ? value.toISOString() : String(value);
}

export function searchSelectedKeys<
  T,
  const K extends readonly SearchableKeys<T>[],
>(data: readonly T[], searchTerm: string, keys: K): T[] {
  const term = searchTerm.trim().toLowerCase();
  if (!term) return [...data];

  return data.filter((item) =>
    keys.some((key) => {
      const value = item[key];
      // Safe due to SearchableKeys<T> constraint; no `any`.
      return toSearchString(value as SearchPrimitive)
        .toLowerCase()
        .includes(term);
    }),
  );
}
/* Usage
    const result = searchSelectedKeys(USERS, 'matt', ['name', 'email', 'id'] as const);
*/

export function normalizeSearchTerm(term: string): string {
  return term.trim().toLowerCase();
}
