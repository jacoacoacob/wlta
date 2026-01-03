import { getAssertIsLoggedIn, getDb } from "~/utils";
import type { ServiceParams } from "./_utils";
import { getFormString, getOptionalFormString } from "~/utils/form-data";
import { TagsModel } from "~/model/tags";

export namespace TagsService {

  export async function create({ context, request }: ServiceParams) {
    getAssertIsLoggedIn(context);
  
    const db = getDb(context);
  
    const formData = await request.formData();
  
    const name = getFormString(formData, "name");
    const description = getOptionalFormString(formData, "description");
  
    const { data: tag, error } = await TagsModel.create({ db, name, description });

    return { tag, error };
  }
  
  export async function search({ context, request }: ServiceParams) {
    const user = getAssertIsLoggedIn(context);
  
    const db = getDb(context);
  
    const url = new URL(request.url);

    const name = url.searchParams.get("name") ?? "";

    const { data: tags, error } = await TagsModel.search({ db, user, name });
    
    if (error) {
      return { error, tags: [] };
    }

    return { tags };
  }
}

