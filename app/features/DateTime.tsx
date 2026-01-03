import type React from "react";

interface DateTimeProps {
  timestamp: string;
}

/**
 * A component to display timestamps in a curated set of formats
 */
export const DateTime: React.FC<DateTimeProps> = ({ timestamp }) => {
  const date = new Date(timestamp);

  return date.toDateString();
}