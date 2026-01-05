import type { BaseModelParams } from "./_utils";

export namespace TagsModel {

  interface GetTagByIdParams extends BaseModelParams {
    tagId: string;
  }

  export async function getById({
    db,
    user,
    tagId,
    is_archived = false,
  }: GetTagByIdParams) {
    return db
      .schema("api")
      .from("tags")
      .select(`
        *,
        categories (
          id,
          name,
          description
        )
      `)
      .eq("user_id", user.id)
      .eq("id", tagId)
      .eq("is_archived", is_archived)
      .single();
  }

  export async function getList({
    db,
    user,
    is_archived = false
  }: BaseModelParams) {
    return db
      .schema("api")
      .from("tags")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_archived", is_archived);
  }

  interface CreateParams extends Omit<BaseModelParams, "user"> {
    name: string;
    description: string | undefined;
  }

  export async function create({ name, description, db }: CreateParams) {
    return await db
      .schema("api")
      .from("tags")
      .insert({ name, description })
      .select()
      .single();
  }

  interface UpdateTagsParams extends BaseModelParams {
    name?: string;
    description?: string;
  }

  export async function update({
    db,
    user,
    name,
    description
  }: UpdateTagsParams) {
    return db
      .schema("api")
      .from("tags")
      .update({ name, description })
      .match({
        user_id: user.id,
      });
  }

  interface SearchParams extends BaseModelParams {
    name: string;
  }

  export async function search({
    db,
    user,
    name,
    is_archived = false,
  }: SearchParams) {
    return await db
      .schema("api")
      .from("tags")
      .select("*")
      .match({ user_id: user.id, is_archived })
      .ilike("name", `%${name}%`);
  }
}