import { data, Form, NavLink, redirect } from "react-router";
import type { Route } from "./+types/dashboard-tags-edit";

import type { BreadcrumbHandle } from "~/utils/breadcrumb";
import { supabaseContext } from "~/context";
import { getAssertIsLoggedIn } from "~/utils";
import { InputField, TextareaField } from "~/patterns";
import { Fieldset, Legend } from "@headlessui/react";
import { Button } from "~/patterns/Button";
import { Toolbar } from "~/patterns/Toolbar";
import { getFormString } from "~/utils/form-data";
import { TagsModel } from "~/model/tags.model";
import { TagsCategoriesForm } from "~/features/TagsCategoriesForm";
import { Categories } from "~/model/categories";

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
  const user = getAssertIsLoggedIn(context)
  
  const db = context.get(supabaseContext);

  const { data: tag, error: tagError } = await TagsModel.getById({
    db,
    user,
    tagId: params.tagId,
  });

  if (tagError) {
    console.warn(tagError);
  }

  if (!tag) {
    throw data(tagError, { status: 404 });
  }

  const { data: categories } = await Categories.getList({
    db,
    user,
  });

  return { tag, categories };
}

export async function action({ context, request, params }: Route.ActionArgs) {
  const user = getAssertIsLoggedIn(context);

  const formData = await request.formData();

  const name = getFormString(formData, "name");
  const description = getFormString(formData, "description");

  const db = context.get(supabaseContext);

  const { error } = await TagsModel.update({
    db,
    user,
    name,
    description
  });

  if (error) {
    console.warn(error);

    return { error };
  }

  return redirect(`/dashboard/tags/${params.tagId}`)
}

export default function DashboardCategoriesEdit({ loaderData }: Route.ComponentProps) {
  const { tag, categories } = loaderData;

  const tagCategoryIds = tag.categories.map((category) => category.id);

  return (
    <div>
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
      
      <TagsCategoriesForm tagId={tag.id} categories={categories} selected={tagCategoryIds} />
    </div>
  ) 
}