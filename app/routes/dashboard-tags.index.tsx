import { data, NavLink } from "react-router";
import { Toolbar } from "~/patterns/Toolbar";
import type { Route } from "./+types/dashboard-tags.index";
import { supabaseContext } from "~/context";
import { TagsModel } from "~/model";
import { getAssertIsLoggedIn } from "~/utils";

export async function loader({ context }: Route.LoaderArgs) {
  const user = getAssertIsLoggedIn(context);
  
  const db = context.get(supabaseContext);
  
  const { data: tags, error } = await TagsModel.getList({ db, user });

  if (error) {
    console.warn(error);
  }

  if (!tags) {
    throw data(error, { status: 404 });
  }

  return { tags };
}

export default function DashboardTagsIndex({ loaderData }: Route.ComponentProps) {
  const { tags } = loaderData;

  return (
    <div className="flex flex-col gap-4">
      <Toolbar heading="Your Tags">
        <NavLink className="button button--solid" to="/dashboard/tags/create">
          + New Tag
        </NavLink>
      </Toolbar>
      <ul className="space-y-2">
        {tags.map(({ id, name, description }) =>
          <li key={id} className="border border-zinc-400 rounded flex">
            <NavLink to={`/dashboard/tags/${id}`} className="flex flex-col flex-1 p-4">
              <h4 className="font-bold flex items-center gap-2">
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