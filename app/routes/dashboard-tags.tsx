import { Outlet } from "react-router";
import type { BreadcrumbHandle } from "~/utils/breadcrumb";

export const handle: BreadcrumbHandle = {
  breadcrumb: () => ({
    name: "Tags",
    to: "/dashboard/tags"
  }),
}

export default function DashboardTags() {
  return (
    <Outlet />
  ) 
}