import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/database.types";

export namespace TagsCategogies {
  
  interface TagsCategoriesParams {
    db: SupabaseClient<Database>;
    tag_id: string;
    category_id: string;
  }

  export function create({ db, category_id, tag_id }: TagsCategoriesParams) {
    return db
      .schema("api")
      .from("categories_tags")
      .insert({ category_id, tag_id })
      .select();
  }

  export async function remove({
    db,
    category_id,
    tag_id,
  }: TagsCategoriesParams) {
    return db
      .schema("api")
      .from("categories_tags")
      .delete()
      .match({ category_id, tag_id })
      .select()
  }

}