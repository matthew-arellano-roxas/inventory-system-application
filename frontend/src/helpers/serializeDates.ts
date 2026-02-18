type Primitive = string | number | boolean | null | undefined;

export type SerializeDates<T> = T extends Date
  ? string
  : T extends Primitive
    ? T
    : T extends Array<infer U>
      ? SerializeDates<U>[]
      : T extends object
        ? { [K in keyof T]: SerializeDates<T[K]> }
        : T;

export function serializeDates<T>(data: T): SerializeDates<T> {
  if (data === null || data === undefined) {
    return data as SerializeDates<T>;
  }

  if (data instanceof Date) {
    return data.toISOString() as SerializeDates<T>;
  }

  if (Array.isArray(data)) {
    return data.map((item) => serializeDates(item)) as SerializeDates<T>;
  }

  if (typeof data === "object") {
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(data)) {
      result[key] = serializeDates(value);
    }

    return result as SerializeDates<T>;
  }

  return data as SerializeDates<T>;
}
