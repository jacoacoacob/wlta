import { data, Form, NavLink, redirect } from "react-router";
import type { Route } from "./+types/dashboard-categories-edit";

import type { BreadcrumbHandle } from "~/utils/breadcrumb";
import { supabaseContext } from "~/context";
import { assertIsLoggedIn, isNonEmptyString, isString } from "~/utils";
import { InputField, TextareaField } from "~/patterns";
import { Fieldset, Legend } from "@headlessui/react";
import { Button } from "~/patterns/Button";

export const handle: BreadcrumbHandle = {
  breadcrumb: [
    ({ params, loaderData }) => {
      const { category } = loaderData as Route.ComponentProps["loaderData"];
      const { categoryId } = params as Route.ComponentProps["params"];

      return {
        name: category.name,
        to: `/dashboard/categories/${categoryId}`,
      };
    },
    ({ pathname }) => ({ name: "Edit", to: pathname }),
  ]
}

export async function loader({ context, params }: Route.LoaderArgs) {
  const user = assertIsLoggedIn(context)
  
  const db = context.get(supabaseContext);

  const { data: category, error } = await db
    .schema('api')
    .from("categories")
    .select(`
      *,
      tags (*)
    `)
    .eq("user_id", user.id)
    .eq("id", params.categoryId)
    .eq("is_archived", false)
    .single();

  if (error) {
    console.warn(error);
  }

  if (!category) {
    throw data(error, { status: 404 });
  }

  return { category };
}

export async function action({ context, request, params }: Route.ActionArgs) {
  const user = assertIsLoggedIn(context);

  const formData = await request.formData();

  const name = formData.get("name");
  const description = formData.get("description");
  const color = formData.get("color");

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

  if (!isString(color) || typeof color === "undefined") {
    return {
      error: {
        message: "Invalid value for color",
      },
    };
  }

  const db = context.get(supabaseContext);

  const { error } = await db
    .schema("api")
    .from("categories")
    .update({ name, description, color })
    .eq("user_id", user.id)
    .eq("id", params.categoryId)
    .select("id")
    .single();

  if (error) {
    console.warn(error);

    return { error };
  }

  return redirect(`/dashboard/categories/${params.categoryId}`)
}

export default function DashboardCategoriesEdit({ loaderData }: Route.ComponentProps) {
  const { category } = loaderData;

  return (
    <Form method="put" className="space-y-8">
      <Fieldset className="space-y-4">
        <Legend>
          <h1 className="font-bold text-3xl">
            Edit Category
          </h1>
        </Legend>
        <InputField
          defaultValue={category.name}
          label="Name"
          name="name"
          type="text"
        />
        <TextareaField
          defaultValue={category.description ?? undefined}
          label="Description"
          name="description"
        />
        <InputField
          defaultValue={category.color ?? undefined}
          label="Color"
          name="color"
          type="color"
        />
      </Fieldset>
      <div className="flex items-center justify-end-safe gap-6">
        <div className="order-2">
          <Button type="submit">Save</Button>
        </div>
        <div>
          <NavLink to={`/dashboard/categories/${category.id}`}>
            Cancel
          </NavLink>
        </div>
      </div>
    </Form>
  ) 
}