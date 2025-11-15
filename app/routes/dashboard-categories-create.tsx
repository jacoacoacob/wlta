import type { BreadcrumbHandle } from "~/utils/breadcrumb";
import type { Route } from "./+types/dashboard-categories-create";
import { supabaseContext } from "~/context";
import { isNonEmptyString } from "~/utils";
import { Form, redirect } from "react-router";
import { Input } from "~/patterns";

export const handle: BreadcrumbHandle = {
  breadcrumb: () => ({
    name: "New Category",
    to: "/dashboard/categories/create" 
  }),
}

export async function action({ context, request }: Route.ActionArgs) {
  const formData = await request.formData();

  const name = formData.get("name");
  const description = formData.get("description");
  const color = formData.get("color");

  console.log({ name, description, color })

  if (!isNonEmptyString(name)) {
    return {
      error:{
        message: "You must give this category a name",
      }
    }
  }

  const db = context.get(supabaseContext);

  const { data, error } = await db
    .schema("api")
    .from("categories")
    .insert({ name, description, color })
    .select("id")
    .single();

  if (error) {
    console.warn(error);

    return { error };
  }

  return redirect(`/dashboard/categories/${data.id}`)
}

export default function DashboardCategoriesCreate() {
  return (
    <>
      <div>Create a new Category</div>

      <Form method="post">
        <Input label="Name" name="name" type="text" />
        <Input label="Description" name="description" type="text" />
        <Input label="Color" name="color" type="color" />
        <button type="submit">Submit</button>
      </Form>
    </>
  ) 
}