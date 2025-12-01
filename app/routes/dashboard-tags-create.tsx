import { Fieldset, Legend } from "@headlessui/react";
import { Form, NavLink, redirect } from "react-router";
import { InputField, TextareaField } from "~/patterns";
import { Button } from "~/patterns/Button";
import { isNonEmptyString, type BreadcrumbHandle } from "~/utils";
import type { Route } from "./+types/dashboard-tags-create";
import { supabaseContext } from "~/context";

export const handle: BreadcrumbHandle = {
  breadcrumb: () => ({
    name: "New Tag",
    to: "/dashboard/tags/create",
  }),
};

export async function action({ context, request }: Route.ActionArgs) {
  const formData = await request.formData();

  const name = formData.get("name");
  const description = formData.get("description");

  if (!isNonEmptyString(name)) {
    return {
      error: {
        message: "A tag must have a name!"
      }
    }
  }

  const db = context.get(supabaseContext);

  const { data, error } = await db
    .schema("api")
    .from("tags")
    .insert({ name, description })
    .select("id")
    .single();

  if (error) {
    console.warn(error);
    
    return { error };
  }

  return redirect(`/dashboard/tags/${data.id}`);
}

export default function DashboardTagsCreate() {
  return (
    <Form method="post" className="space-y-8">
      <Fieldset className="space-y-4">
        <Legend>
          <h1 className="font-bold text-3xl">
            Create a new Tag
          </h1>
          <p>
            Tags represent a specific activity. You can organize them using <NavLink className="link underline" to="/dashboard/categories">categories</NavLink>.
          </p>
        </Legend>
        <InputField label="Name" name="name" type="text" />
        <TextareaField label="Description" name="description" />
      </Fieldset>
      <div className="flex items-center justify-end-safe gap-6">
        <div className="order-2">
          <Button type="submit">Save</Button>
        </div>
        <div>
          <NavLink className="link underline" to="/dashboard/tags">
            Cancel
          </NavLink>
        </div>
      </div>
    </Form>
  )
}