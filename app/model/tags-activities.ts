import type { BaseModelParams } from "./_utils";

export namespace TagsActivities {

  interface CreateParams extends Omit<BaseModelParams, "user"> {
    activity_id: string;
    tag_id: string;
  }

  export async function create({
    db,
    activity_id,
    tag_id,
  }: CreateParams) {
    return await db
      .schema("api")
      .from("tags_activities")
      .insert({ activity_id, tag_id })
      .select()
      .single();
  }

  interface DestroyParams extends BaseModelParams {
    activity_id: string;
    tag_id: string;
  }

  export async function destroy({
    db,
    user,
    activity_id,
    tag_id,
  }: DestroyParams) {
    return await db
      .schema("api")
      .from("tags_activities")
      .delete()
      .match({ activity_id, tag_id, user_id: user.id });
  }

}