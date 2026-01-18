import type React from "react";
import { isNull } from "~/utils";

interface DateTimeProps extends Intl.DateTimeFormatOptions {
  timestamp: string | null;
  /**
   * Fallback content to show if `timestamp` is null or cannot be converted to a {@link Date}
   */
  fallback?: React.ReactNode;
}

function isValidDate(date: Date | null) {
  if (isNull(date)) {
    return false;
  }

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  return true;
}

/**
 * A component to display timestamps in a curated set of formats
 */
export const DateTime: React.FC<DateTimeProps> = ({
  timestamp,
  fallback,
  ...formatOptions
}) => {
  const date = new Date(timestamp ?? "");

  if (isValidDate(date)) {

    const formatter = new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
      ...formatOptions,
    });

    return formatter.format(date);
  }

  return fallback ?? null;
}