type Primitive = string | number | boolean | null | undefined;
const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;

export type DeserializeDates<T> = T extends string
  ? Date | string
  : T extends Primitive
    ? T
    : T extends Array<infer U>
      ? DeserializeDates<U>[]
      : T extends object
        ? { [K in keyof T]: DeserializeDates<T[K]> }
        : T;

export function deserializeDates<T>(data: T): DeserializeDates<T> {
  if (data === null || data === undefined) {
    return data as DeserializeDates<T>;
  }

  if (typeof data === "string" && isoDateRegex.test(data)) {
    return new Date(data) as DeserializeDates<T>;
  }

  if (Array.isArray(data)) {
    return data.map((item) => deserializeDates(item)) as DeserializeDates<T>;
  }

  if (typeof data === "object") {
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(data)) {
      result[key] = deserializeDates(value);
    }

    return result as DeserializeDates<T>;
  }

  return data as DeserializeDates<T>;
}
