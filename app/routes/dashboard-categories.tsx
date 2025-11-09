import { Outlet } from "react-router";
import type { BreadcrumbHandle } from "~/utils/breadcrumb";

export const handle: BreadcrumbHandle = {
  breadcrumb: () => ({
    name: "Categories",
    to: "/dashboard/categories"
  })
}

export default function DashboardCategories() {
  return (
    <Outlet />
  ) 
}