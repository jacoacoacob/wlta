import type { BaseModelParams } from "./_utils";

export namespace Categories {
  interface GetCategoryByIdParams extends BaseModelParams {
    categoryId: string;
  }
  
  export async function getById({
    db,
    user,
    categoryId,
    is_archived = false
  }: GetCategoryByIdParams) {
    return await db
      .schema('api')
      .from("categories")
      .select(`
        *,
        tags (*)
      `)
      .eq("user_id", user.id)
      .eq("id", categoryId)
      .eq("is_archived", is_archived)
      .single();
  }
  
  export async function getList({
    db,
    user,
    is_archived = false,
  }: BaseModelParams) {
    return await db
      .schema("api")
      .from("categories")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_archived", is_archived);
  }

  interface CreateCategoryParams extends Omit<BaseModelParams, "user"> {
    name: string;
    description: string | undefined;
    color: string | undefined;
  }

  export async function create({
    db,
    name,
    description,
    color
  }: CreateCategoryParams) {
    return await db
      .schema("api")
      .from("categories")
      .insert({ name, description, color })
      .select()
      .single();    
  }
  
  interface UpdateCategoryParams extends BaseModelParams {
    categoryId: string;
    name: string;
    description: string | undefined;
    color: string | undefined;
  }
  
  export async function update({
    db,
    user,
    categoryId,
    name,
    description,
    color
  }: UpdateCategoryParams) {
    return await db
      .schema("api")
      .from("categories")
      .update({ name, description, color })
      .eq("user_id", user.id)
      .eq("id", categoryId)
      .select()
      .single();
  }
}
