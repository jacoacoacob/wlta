import type { BreadcrumbHandle } from "~/utils/breadcrumb";
import type { Route } from "./+types/dashboard-categories-create";
import { supabaseContext } from "~/context";
import { Form, NavLink, redirect } from "react-router";
import { InputField, TextareaField } from "~/patterns";
import { Button } from "~/patterns/Button";
import { Fieldset, Legend } from "@headlessui/react";
import { Categories } from "~/model/categories";
import { getFormString, getOptionalFormString } from "~/utils/form-data";

export const handle: BreadcrumbHandle = {
  breadcrumb: () => ({
    name: "New Category",
    to: "/dashboard/categories/create" 
  }),
}

export async function action({ context, request }: Route.ActionArgs) {
  const formData = await request.formData();

  const name = getFormString(formData, "name");
  const description = getOptionalFormString(formData, "description");
  const color = getOptionalFormString(formData, "color");

  const db = context.get(supabaseContext);

  const { data, error } = await Categories.create({
    db,
    name,
    description,
    color
  });

  if (error) {
    console.warn(error);

    return { error };
  }

  return redirect(`/dashboard/categories/${data.id}`)
}

export default function DashboardCategoriesCreate() {
  return (
    <Form method="post" className="space-y-8">
      <Fieldset className="space-y-4">
        <Legend>
          <h1 className="font-bold text-3xl">
            Create a new Category
          </h1>
        </Legend>
        <InputField label="Name" name="name" type="text" />
        <TextareaField label="Description" name="description" />
        <InputField label="Color" name="color" type="color" />
      </Fieldset>
      <div className="flex items-center justify-end-safe gap-6">
        <div className="order-2">
          <Button type="submit">Save</Button>
        </div>
        <div>
          <NavLink to="/dashboard/categories">
            Cancel
          </NavLink>
        </div>
      </div>
    </Form>
  ) 
}