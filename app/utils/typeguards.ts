export function isString(data: unknown): data is string {
  return typeof data === "string";
}

export function isNumber(data: unknown): data is number {
  return typeof data === "string" && !Number.isNaN(data);
}

export function isNonEmptyString(data: unknown): data is string {
  return isString(data) && data.trim().length > 0;
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
