import { data, Form, NavLink, redirect } from "react-router";
import type { Route } from "./+types/dashboard-tags-edit";

import type { BreadcrumbHandle } from "~/utils/breadcrumb";
import { supabaseContext } from "~/context";
import { assertIsLoggedIn, isNonEmptyString, isString } from "~/utils";
import { InputField, TextareaField } from "~/patterns";
import { Fieldset, Legend } from "@headlessui/react";
import { Button } from "~/patterns/Button";
import { Toolbar } from "~/patterns/Toolbar";

export const handle: BreadcrumbHandle = {
  breadcrumb: [
    ({ params, loaderData }) => {
      const { tag } = loaderData as Route.ComponentProps["loaderData"];
      const { tagId } = params as Route.ComponentProps["params"];

      return {
        name: tag.name,
        to: `/dashboard/tags/${tagId}`,
      };
    },
    ({ pathname }) => ({ name: "Edit", to: pathname }),
  ]
}

export async function loader({ context, params }: Route.LoaderArgs) {
  const user = assertIsLoggedIn(context)
  
  const db = context.get(supabaseContext);

  const { data: tag, error } = await db
    .schema('api')
    .from("tags")
    .select(`
      *,
      categories (*)
    `)
    .eq("user_id", user.id)
    .eq("id", params.tagId)
    .eq("is_archived", false)
    .single();

  if (error) {
    console.warn(error);
  }

  if (!tag) {
    throw data(error, { status: 404 });
  }

  return { tag };
}

export async function action({ context, request, params }: Route.ActionArgs) {
  const user = assertIsLoggedIn(context);

  const formData = await request.formData();

  const name = formData.get("name");
  const description = formData.get("description");

  if (!isNonEmptyString(name)) {
    return {
      error:{
        message: "You must give this category a name",
      }
    }
  }

  if (!isString(description) || typeof description === "undefined") {
    return {
      error: {
        message: "Invalid value for description",
      },
    };
  }

  const db = context.get(supabaseContext);

  const { error } = await db
    .schema("api")
    .from("tags")
    .update({ name, description })
    .eq("user_id", user.id)
    .eq("id", params.tagId)
    .select("id")
    .single();

  if (error) {
    console.warn(error);

    return { error };
  }

  return redirect(`/dashboard/tags/${params.tagId}`)
}

export default function DashboardCategoriesEdit({ loaderData }: Route.ComponentProps) {
  const { tag } = loaderData;

  return (
    <Form method="put" className="space-y-8">
      <Fieldset className="space-y-4">
        <Legend>
          <Toolbar heading="Edit Tag" />
        </Legend>
        <InputField
          defaultValue={tag.name}
          label="Name"
          name="name"
          type="text"
        />
        <TextareaField
          defaultValue={tag.description ?? undefined}
          label="Description"
          name="description"
        />
      </Fieldset>
      <div className="flex items-center justify-end-safe gap-6">
        <div className="order-2">
          <Button type="submit">Save</Button>
        </div>
        <div>
          <NavLink to={`/dashboard/tags/${tag.id}`}>
            Cancel
          </NavLink>
        </div>
      </div>
    </Form>
  ) 
}