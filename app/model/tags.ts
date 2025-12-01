import type { BaseModelParams } from "./_utils";

export namespace Tags {

  interface GetTagByIdParams extends BaseModelParams {
    tagId: string;
  }

  export async function getById({
    db,
    user,
    tagId,
    isArchived = false,
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
      .eq("is_archived", isArchived)
      .single();
  }

  export async function getList({
    db,
    user,
    isArchived = false
  }: BaseModelParams) {
    return db
      .schema("api")
      .from("tags")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_archived", isArchived);
  }
}