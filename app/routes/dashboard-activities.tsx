import { Outlet } from "react-router";
import type { BreadcrumbHandle } from "~/utils/breadcrumb";

export const handle: BreadcrumbHandle = {
  breadcrumb: () => ({
    name: "Activities",
    to: "/dashboard/activities"
  }),
}

export default function DashboardActivities() {
  return (
    <Outlet />
  )
}
