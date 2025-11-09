import { getCategoryById } from "~/models/categories";
import type { Route } from "./+types/dashboard-categories-detail";
import { data, NavLink } from "react-router";
import type { BreadcrumbHandle } from "~/utils/breadcrumb";

export function loader({ params }: Route.LoaderArgs) {
  const category = getCategoryById(params.categoryId);

  if (!category) {
    throw data(
      { message: `We couldn't find a category with id ${params.categoryId}` },
      { status: 404 }
    );
  }

  return category;
}

export const handle: BreadcrumbHandle = {
  breadcrumb: ({ loaderData }) => {
    const { name, id } = loaderData as Route.ComponentProps["loaderData"];

    return {
      name,
      to: `/dashboard/categories/${id}` 
    };
  },
}

export default function DashboardCategoriesDetail({ loaderData }: Route.ComponentProps) {
  const { name, id, description } = loaderData;

  return (
    <div className="flex flex-col gap-4">
      <h1>Category: {name}</h1>
      <p>{description}</p>
      <div>
        <NavLink
          className="border rounded bg-blue-500 p-2 text-white"
          to="edit"
        >
          Edit
        </NavLink>
      </div>
    </div>
  ) 
}