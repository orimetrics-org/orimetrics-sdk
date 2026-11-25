export type JsonObject = Record<string, unknown>;

export const objectValue = (value: unknown, label: string): JsonObject => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`Expected an object: ${label}`);
  }

  return value as JsonObject;
};

export const stringValue = (value: unknown, label: string): string => {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`Expected a nonempty string: ${label}`);
  }

  return value;
};
