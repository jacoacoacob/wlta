import { getAssertIsLoggedIn, isNonEmptyString, isString, type BreadcrumbHandle } from "~/utils";
import type { Route } from "./+types/dashboard-activities.create";
import { TagsModel } from "~/model";
import { supabaseContext } from "~/context";
import { getFormString, getOptionalFormString } from "~/utils/form-data";
import { ActivitiesModel } from "~/model/activities.model";
import { TagsActivities } from "~/model/tags-activities";
import { Form, NavLink, redirect, useSubmit } from "react-router";
import { Button, Fieldset, Legend } from "@headlessui/react";
import { InputField } from "~/patterns";
import { CreateActivityTagsInput } from "~/features/CreateActivityTagsInput";
import { useCallback, type FormEventHandler } from "react";
import { ActivitiesService } from "~/services/activities.service";

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
  const activitiesService = new ActivitiesService({ context, request });

  const { data: activity, error } = await activitiesService.createActivity();

  if (error) {
    return { error };
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

  const formattedNow = `${year}-${month}-${day}T${hour}:${minute}`;

  const submit = useSubmit();

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback((ev) => {
    ev.preventDefault();
    
    const formData = new FormData(ev.currentTarget);

    function toUTCDateString(data: FormDataEntryValue | null) {
      if (isString(data)) {
        try {
          return new Date(data).toISOString();
        } catch { /* empty */ }
      }

      return "";
    }

    function csvToStringArray(data: FormDataEntryValue | null) {
      if (isString(data)) {
        return data.split(",");
      }

      return "";
    }

    submit(
      {
        started_at: toUTCDateString(formData.get("started_at")),
        ended_at: toUTCDateString(formData.get("ended_at")),
        tags: csvToStringArray(formData.get("tags")),
      },
      { method: "post" }
    );

  }, [submit]);  

  return (
    <Form method="post" className="space-y-8" onSubmit={handleSubmit}>
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
        <InputField
          label="Started At"
          name="started_at"
          type="datetime-local"
          defaultValue={formattedNow}
        />
        <InputField label="Ended At" name="ended_at" type="datetime-local" />

        <CreateActivityTagsInput />

        <Button type="submit">Save</Button>
      </Fieldset>
    </Form>
  )
}
