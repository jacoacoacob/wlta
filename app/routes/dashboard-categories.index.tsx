import type { Route } from "./+types/dashboard-categories.index";
import { data, NavLink } from "react-router";
import { supabaseContext } from "~/context";

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
      <div>
        <NavLink
          className="border rounded bg-blue-500 p-2 text-white"
          to="/dashboard/categories/create"
        >
          + New Category
        </NavLink>
      </div>
      <h2 className="text-xl font-bold">Your Categories</h2>
      <ul className=" space-y-2">
        {categories.map(({ id, name, description }) =>
          <li className="border border-zinc-400 rounded flex">
            <NavLink to={`/dashboard/categories/${id}`} className="flex flex-col flex-1 p-4">
              <h4 className="font-bold">{name}</h4>
              <p className="font-light">{description}</p>
            </NavLink>
          </li>
        )}
      </ul>
    </div>
  ) 
}