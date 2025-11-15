import { data, Form, redirect } from "react-router";
import type { Route } from "./+types/dashboard-categories-edit";

import type { BreadcrumbHandle } from "~/utils/breadcrumb";
import { supabaseContext } from "~/context";
import { assertIsLoggedIn, isNonEmptyString, isString } from "~/utils";
import { Input } from "~/patterns";
import { useEffect, useRef } from "react";

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
  const { category } = loaderData

  const nameInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLInputElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.value = category.name;
    }
    
    if (descriptionInputRef.current) {
      descriptionInputRef.current.value = category.description ?? "";
    }
    
    if (colorInputRef.current) {
      colorInputRef.current.value = category.color ?? "";
    }

  }, []);

  return (
    <div>
      <div>Edit Category "{category.name}"</div>

      <Form method="put">
        <Input ref={nameInputRef} label="Name" name="name" type="text" />
        <Input ref={descriptionInputRef} label="Description" name="description" type="text" />
        <Input ref={colorInputRef} label="Color" name="color" type="color" />
        <button type="submit">Submit</button>
      </Form>
    </div>
  ) 
}