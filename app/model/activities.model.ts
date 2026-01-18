import type { BaseModelParams } from "./_utils";


export namespace ActivitiesModel {
  
  interface CreateParams extends Omit<BaseModelParams, "user"> {
    started_at: string;
    ended_at: string | null;
  }

  export async function create({
    db,
    started_at,
    ended_at
  }: CreateParams) {
    return await db
      .schema("api")
      .from("activities")
      .insert({ started_at, ended_at })
      .select()
      .single();
  }

  export async function getList({
    db,
    user,
    is_archived = false
  }: BaseModelParams) {
    return await db
      .schema("api")
      .from("activities")
      .select(`
        *,
        tags (
          id,
          name
        )
      `)
      .match({ user_id: user.id, is_archived });
  }
  
  interface GetByIdParams extends BaseModelParams {
    activityId: string;
  }

  export async function getById({
    db,
    user,
    activityId,
    is_archived = false,
  }: GetByIdParams) {
    return await db
      .schema("api")
      .from("activities")
      .select(`
        *,
        tags (*)
      `)
      .match({
        id: activityId,
        user_id: user.id,
        is_archived
      })
      .single();
  }

}