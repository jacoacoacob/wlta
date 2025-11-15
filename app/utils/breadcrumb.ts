import type { LinkProps, UIMatch } from "react-router";

export interface BreadcrumbData {
  name: string,
  to: LinkProps["to"];
}

export type Breadcrumb = (match: UIMatch) => BreadcrumbData;

export interface BreadcrumbHandle {
  breadcrumb: Breadcrumb | Breadcrumb[];
}

export function isBreadcrumbHandle(data: unknown): data is BreadcrumbHandle {
  return (
    typeof data === "object" &&
    data !== null &&
    Object.prototype.hasOwnProperty.call(data, "breadcrumb")
  );
}