import { ActivitiesService } from "~/services/activities.service";
import type { Route } from "./+types/dashboard-activities.detail";
import { data, NavLink } from "react-router";
import { Toolbar } from "~/patterns/Toolbar";

export async function loader({ context, request, params }: Route.LoaderArgs) {
  const activitiesService = new ActivitiesService({ context, request });

  const { activity, error } = await activitiesService.getActivityById(params.activityId);
  
  if (error) {
    throw data(error, { status: 404 });
  }

  return { activity };
}

export default function DashboardActivitiesDetail({ loaderData }: Route.ComponentProps) {
  const { activity } = loaderData;

  const { tags, started_at, ended_at } = activity;

  return (
    <div className="flex flex-col gap-4">
      <Toolbar className="dark:bg-transparent bg-transparent outline-none justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          {tags.map((tag) => <span key={tag.id}>{tag.name}</span>)}
        </h1>
        <NavLink className="button button--solid" to="edit">
          Edit
        </NavLink>
      </Toolbar>
    </div>
  )
}
