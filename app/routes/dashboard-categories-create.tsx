import type { BreadcrumbHandle } from "~/utils/breadcrumb";

export const handle: BreadcrumbHandle = {
  breadcrumb: () => ({
    name: "New Category",
    to: "/dashboard/categories/create" 
  }),
}

export default function DashboardCategoriesCreate() {
  return (
    <>
      <div>Create a new Category</div>
    </>
  ) 
}