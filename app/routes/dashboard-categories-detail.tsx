import type { Route } from "./+types/dashboard-categories-detail";
import { data, NavLink } from "react-router";
import type { BreadcrumbHandle } from "~/utils/breadcrumb";
import { assertIsLoggedIn } from "~/utils";
import { supabaseContext } from "~/context";
import { Toolbar } from "~/patterns/Toolbar";

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

  const { name, color, description } = category;

  return (
    <div className="flex flex-col gap-4">
      <Toolbar className="dark:bg-transparent bg-transparent outline-none justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <div className="h-6 w-6 rounded" style={{ backgroundColor: color ?? undefined }}></div>
          {name}
        </h1>
        <NavLink className="button button--solid" to="edit">
          Edit
        </NavLink>
      </Toolbar>
      <p>{description}</p>
      <pre>{JSON.stringify(category, null, 2)}</pre>
    </div>
  ) 
}