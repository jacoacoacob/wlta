import { BaseService } from "./_utils";
import { TagsModel } from "~/model/tags.model";

export class TagsService extends BaseService {
  async createTag() {
    const { db, getForm } = this;

    const form = await getForm();

    const name = form.getString("name");
    const description = form.getOptionalString("description");

    const { data: tag, error } = await TagsModel.create({ db, name, description });

    if (error) {
      return { error, tag }
    }

    return { error, tag };
  }

  async searchTags() {
    const { db, request, user } = this;

    const url = new URL(request.url);

    const name = url.searchParams.get("name") ?? "";

    const { data: tags, error } = await TagsModel.search({ db, name, user });

    if (error) {
      return { error, tags };
    }

    return { tags, error };
  }
}
