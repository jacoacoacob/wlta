import { getAssertIsLoggedIn } from "~/utils";
import type { Route } from "./+types/dashboard-activities.index";
import { supabaseContext } from "~/context";
import { Activities } from "~/model/activities";
import { data, NavLink } from "react-router";
import { Toolbar } from "~/patterns/Toolbar";
import { DateTime } from "~/features/DateTime";

export async function loader({ context }: Route.LoaderArgs) {
  const user = getAssertIsLoggedIn(context);

  const db = context.get(supabaseContext);

  const { data: activities, error } = await Activities.getList({ db, user });

  if (error) {
    console.warn(error);
  }

  if (!activities) {
    throw data(error, { status: 404 });
  }

  return { activities };
}

export default function DashboardActivitiesIndex({ loaderData }: Route.ComponentProps) {
  const { activities } = loaderData;

  return (
    <div className="flex flex-col gap-4">
      <Toolbar heading="Your Activities">
        <NavLink className="button button--solid" to="/dashboard/activities/create">
          + New Activity
        </NavLink>
      </Toolbar>
      <ul className="space-y-2">
        {activities.map(({ id, tags, started_at, ended_at }) =>
          <li key={id} className="border border-zinc-400 rounded flex">
            <NavLink to={`/dashboard/activities/${id}`} className="flex flex-col flex-1 p-4">
              <h4 className="font-bold flex items-center gap-2">
                {tags.map(({ name }) =>
                  <span key={name} className="inline-block px-2 py-4 rounded border">
                    {name}
                  </span>
                )}
              </h4>
              <p className="font-light">
                <DateTime timestamp={started_at} /> - <DateTime timestamp={ended_at} />
              </p>
            </NavLink>
          </li>
        )}
      </ul>
    </div>
  )
}
