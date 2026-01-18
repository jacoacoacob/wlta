import type { Route } from "./+types/dashboard-activities.index";
import { data, NavLink } from "react-router";
import { Toolbar } from "~/patterns/Toolbar";
import { DateTime } from "~/features/DateTime";
import { ActivitiesService } from "~/services/activities.service";

export async function loader({ context, request }: Route.LoaderArgs) {

  const activitiesService = new ActivitiesService({ context, request });

  const { activities, error } = await activitiesService.getActivityList();

  if (error) {
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
                <DateTime timestamp={started_at} /> {ended_at && "-"} <DateTime timestamp={ended_at} fallback="- Incomplete" />
              </p>
            </NavLink>
          </li>
        )}
      </ul>
    </div>
  )
}
