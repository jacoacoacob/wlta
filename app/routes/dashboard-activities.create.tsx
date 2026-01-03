import { getAssertIsLoggedIn, isNonEmptyString, type BreadcrumbHandle } from "~/utils";
import type { Route } from "./+types/dashboard-activities.create";
import { TagsModel } from "~/model";
import { supabaseContext } from "~/context";
import { getFormString, getOptionalFormString } from "~/utils/form-data";
import { Activities } from "~/model/activities";
import { TagsActivities } from "~/model/tags-activities";
import { Form, NavLink, redirect } from "react-router";
import { Fieldset, Legend } from "@headlessui/react";
import { InputField } from "~/patterns";

export const handle: BreadcrumbHandle = {
  breadcrumb: () => ({
    name: "New Activity",
    to: "/dashboard/activities/create"
  })
}

export async function loader({ context }: Route.LoaderArgs) {
  const user = getAssertIsLoggedIn(context);
  const db = context.get(supabaseContext);

  const { data: tags } = await TagsModel.getList({ user, db });

  return { tags };
}

export async function action({ context, request }: Route.ActionArgs) {
  getAssertIsLoggedIn(context);
  
  const db = context.get(supabaseContext);

  const formData = await request.formData();

  const started_at = getFormString(formData, "started_at");
  const ended_at = getFormString(formData, "ended_at");

  const { data: activity, error } = await Activities.create({ db, started_at, ended_at });

  if (error) {
    console.warn(error);

    return { error };
  }

  const tags = getOptionalFormString(formData, "tags");

  if (isNonEmptyString(tags)) {
    const tagIDs: string[] = JSON.parse(tags);

    await Promise.all(
      tagIDs.map((tag_id) =>
        TagsActivities.create({ db, tag_id, activity_id: activity.id })
      )
    );
  }

  return redirect(`/dashboard/activities/${activity.id}`);
}

export default function DashboardActivitiesCreate({
  actionData,
  loaderData
}: Route.ComponentProps) {
  const { error } = actionData ?? {};
  const { tags } = loaderData;

  const now = new Date();

  const pad = (num: number) => num.toString().padStart(2, '0');

  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hour = pad(now.getHours());
  const minute = pad(now.getMinutes());

  const formattedNow = `${year}-${month}-${day}T${hour}:${minute}`

  return (
    <Form method="post" className="space-y-8">
      <Fieldset className="space-y-4">
        <Legend>
          <h1 className="font-bold text-3xl">
            Create a new Activity
          </h1>
          <p>
            An <em>Activity</em> represents a set of actions you did during a specific period of time.
            Each action that makes up an <em>Activity</em> is represented by a{" "}
            <NavLink className="link underline" to="/dashboard/tags">Tag</NavLink>. 
          </p>
        </Legend>
        <InputField label="Started At" name="started_at" type="datetime-local" defaultValue={formattedNow} />
        <InputField label="Ended At" name="ended_at" type="datetime-local" />


      </Fieldset>
    </Form>
  )
}
