import type { Route } from "./+types/dashboard-categories.index";
import { data, NavLink } from "react-router";
import { supabaseContext } from "~/context";
import { Toolbar } from "~/patterns/Toolbar";

export async function loader({ context }: Route.LoaderArgs) {
  const db = context.get(supabaseContext);

  const { data: categories, error } = await db.schema('api').from("categories").select("*");

  if (error) {
    console.warn(error);
  }

  if (!categories) {
    throw data(error, { status: 404 });
  }

  return { categories };
}

export default function DashboardCategories({ loaderData }: Route.ComponentProps) {
  const { categories } = loaderData;

  return (
    <div className="flex flex-col gap-4">

      <Toolbar className="dark:bg-transparent bg-transparent outline-none justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          Your Categories
        </h1>
        <NavLink
          className="button button--solid"
          to="/dashboard/categories/create"
        >
          + New Category
        </NavLink>
      </Toolbar>
      <ul className=" space-y-2">
        {categories.map(({ id, name, description, color }) =>
          <li key={id} className="border border-zinc-400 rounded flex">
            <NavLink to={`/dashboard/categories/${id}`} className="flex flex-col flex-1 p-4">
              <h4 className="font-bold flex items-center gap-2">
                <div className="h-5 w-5 rounded" style={{ backgroundColor: color ?? undefined }}></div>
                {name}
              </h4>
              <p className="font-light">{description}</p>
            </NavLink>
          </li>
        )}
      </ul>
    </div>
  ) 
}