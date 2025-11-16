import { isNonEmptyString } from "./typeguards";

/**
 * A utility to conditionally apply classNames
 */
export function cn(...classNames: (string | false | null | undefined)[]) {
  return classNames.filter(isNonEmptyString).join(" ");
}