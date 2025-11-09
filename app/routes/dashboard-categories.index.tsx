import { getCategoryList } from "~/models/categories"
import type { Route } from "./+types/dashboard-categories.index";
import { NavLink } from "react-router";

export function loader() {
  return {
    categories: getCategoryList(),
  }
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