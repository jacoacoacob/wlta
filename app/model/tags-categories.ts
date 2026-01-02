import type { BaseModelParams } from "./_utils";

export namespace TagsCategogies {

  interface CreateParams extends Omit<BaseModelParams, "user"> {
    category_id: string;
    tag_id: string;
  }
  
  export function create({ db, category_id, tag_id }: CreateParams) {
    return db
      .schema("api")
      .from("categories_tags")
      .insert({ category_id, tag_id })
      .select()
      .single();
  }
  
  interface DestroyParams extends BaseModelParams {
    category_id: string;
    tag_id: string;
  }

  export function destroy({
    db,
    category_id,
    tag_id,
    user
  }: DestroyParams) {
    return db
      .schema("api")
      .from("categories_tags")
      .delete()
      .match({ category_id, tag_id, user_id: user.id });
  }

}