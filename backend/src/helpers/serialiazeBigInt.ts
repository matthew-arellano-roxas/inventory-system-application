type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

export function serializeBigInt<T>(value: T): JsonValue {
  return JSON.parse(
    JSON.stringify(value, (_, v: unknown): unknown => (typeof v === 'bigint' ? v.toString() : v)),
  ) as JsonValue;
}
