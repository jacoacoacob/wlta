import { data } from "react-router";
import type { Route } from "./+types/api-tags-categories";
import { supabaseContext } from "~/context";
import { getFormString } from "~/utils/form-data";

export async function action({ context, request }: Route.ActionArgs) {
  try {

    const db = context.get(supabaseContext);

    const formData = await request.formData();

    const tag_id = getFormString(formData, "tag_id");
    const category_id = getFormString(formData, "category_id");
  
    if (request.method === "POST") {

      const { error, data: categoryTagLink } = await db
        .schema("api")
        .from("categories_tags")
        .insert([{ tag_id, category_id }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data(categoryTagLink, { status: 201 });
    }
  
    if (request.method === "DELETE") {

      const { error } = await db
        .schema("api")
        .from("categories_tags")
        .delete()
        .eq("tag_id", tag_id)
        .eq("category_id", category_id);

      if (error) {
        throw error;
      }

      return data(null, { status: 204 });
    }

  } catch (error) {
    return { error };
  }

  return data(null, { status: 405, statusText: "Method not allowed" });
}