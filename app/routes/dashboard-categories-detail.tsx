import { getCategoryById } from "~/models/categories_";
import type { Route } from "./+types/dashboard-categories-detail";
import { data, NavLink } from "react-router";
import type { BreadcrumbHandle } from "~/utils/breadcrumb";
import { assertIsLoggedIn } from "~/utils";
import { supabaseContext } from "~/context";

export async function loader({ context, params }: Route.LoaderArgs) {
  const user = assertIsLoggedIn(context)
  
  const db = context.get(supabaseContext);

  const { data: category, error } = await db
    .schema('api')
    .from("categories")
    .select(`
      *,
      tags (*)
    `)
    .eq("user_id", user.id)
    .eq("id", params.categoryId)
    .eq("is_archived", false)
    .single();

  if (error) {
    console.warn(error);
  }

  if (!category) {
    throw data(error, { status: 404 });
  }

  return { category };
}

export const handle: BreadcrumbHandle = {
  breadcrumb: ({ loaderData }) => {
    const { category } = loaderData as Route.ComponentProps["loaderData"];

    const { name, id } = category;
    return {
      name,
      to: `/dashboard/categories/${id}` 
    };
  },
}

export default function DashboardCategoriesDetail({ loaderData }: Route.ComponentProps) {
  const { category } = loaderData;

  const { name, description } = category;

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
      <pre>{JSON.stringify(category, null, 2)}</pre>
    </div>
  ) 
}