import { data, redirect } from "react-router";
import type { Route } from "./+types/dashboard-categories-edit";
import { getCategoryById, getCategoryList } from "~/models/categories";

import type { BreadcrumbHandle } from "~/utils/breadcrumb";

export const handle: BreadcrumbHandle = {
  breadcrumb: ({ pathname, loaderData }) => {
    const { name } = loaderData as Route.ComponentProps["loaderData"];
    
    return {
      name: `Edit Category: ${name}`,
      to: pathname
    }
  }
}

export function loader({ params }: Route.LoaderArgs) {
  const category = getCategoryById(params.categoryId);

  if (!category) {
    throw data({ message: `We couldn't find a category with id ${params.categoryId}` }, { status: 404 })
  }

  return category;
}

export default function DashboardCategoriesEdit({ loaderData }: Route.ComponentProps) {

  return (
    <>
      <div>Edit Category "{loaderData.name}"</div>
    </>
  ) 
}