import { assertIsNonEmptyString, isNonEmptyString } from "./typeguards";


/**
 * Returns the result of `formData.get(fieldName)` if it is a string
 * containing at least one non-whitespace character. Otherwise, throws
 * a TypeError.
 * 
 * @throws {TypeError}
 */
export function getFormString(formData: FormData, fieldName: string) {
  const value = formData.get(fieldName);

  assertIsNonEmptyString(value, fieldName);

  return value;
}

/**
 * Returns the value of `formData.get(fieldName)` if it is a string
 * containing at least one non-whitespace character. Otherwise,
 * returns undefined.
 */
export function getOptionalFormString(formData: FormData, fieldName: string) {
  const value = formData.get(fieldName);

  if (isNonEmptyString(value)) {
    return value;
  }
}