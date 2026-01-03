import { data, Form, NavLink, redirect } from "react-router";
import type { Route } from "./+types/dashboard-categories-edit";

import type { BreadcrumbHandle } from "~/utils/breadcrumb";
import { supabaseContext } from "~/context";
import { getAssertIsLoggedIn } from "~/utils";
import { InputField, TextareaField } from "~/patterns";
import { Fieldset, Legend } from "@headlessui/react";
import { Button } from "~/patterns/Button";
import { Toolbar } from "~/patterns/Toolbar";
import { CategoryTagsForm } from "~/features/TagsCategoriesForm";
import { getFormString } from "~/utils/form-data";
import { Categories, TagsModel } from "~/model";


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
  const user = getAssertIsLoggedIn(context)
  
  const db = context.get(supabaseContext);

  const { data: category, error } = await Categories.getById({
    db,
    user,
    categoryId: params.categoryId
  });

  if (error) {
    console.warn(error);
  }

  if (!category) {
    throw data(error, { status: 404 });
  }

  const { data: tags } = await TagsModel.getList({ db, user });

  return {
    /** The category matching the categoryId in the URL params */
    category,
    /** Tags belonging to this user */
    tags,
  };
}

export async function action({ context, request, params }: Route.ActionArgs) {
  const user = getAssertIsLoggedIn(context);

  const formData = await request.formData();

  const name = getFormString(formData, "name");
  const description = getFormString(formData, "description");
  const color = getFormString(formData, "color");

  const db = context.get(supabaseContext);

  const { error } = await Categories.update({
    db,
    user,
    name,
    color,
    description,
    categoryId: params.categoryId,
  });

  if (error) {
    console.warn(error);

    return { error };
  }

  return redirect(`/dashboard/categories/${params.categoryId}`)
}

export default function DashboardCategoriesEdit({ loaderData }: Route.ComponentProps) {
  const { category, tags } = loaderData;

  return (
    <div>
      <Form method="put" className="space-y-8">
        <Fieldset className="space-y-4">
          <Legend>
            <Toolbar heading="Edit Category" />
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

      <CategoryTagsForm category={category} tags={tags} />
    </div>
  ) 
}