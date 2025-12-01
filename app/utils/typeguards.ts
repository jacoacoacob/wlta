export function isString(data: unknown): data is string {
  return typeof data === "string";
}

export function isNumber(data: unknown): data is number {
  return typeof data === "string" && !Number.isNaN(data);
}

export function isNonEmptyString(data: unknown): data is string {
  return isString(data) && data.trim().length > 0;
}

export function assertIsNonEmptyString(data: unknown, valueName?: string): asserts data is string {
  if (!isNonEmptyString(data)) {
    throw new TypeError(
      `${valueName ?? "value"} must be a string, instead received ${data}`,
    )
  }
}

export function isNull(data: unknown): data is null {
  return data === null;
}

export function isUndefined(data: unknown): data is undefined {
  return data === undefined;
}

export function isNullOrUndefined(data: unknown): data is null | undefined {
  return isNull(data) || isUndefined(data);
}

export function isObject(data: unknown): data is { [key: string]: any } {
  return typeof data === "object" && !isNull(data);
}