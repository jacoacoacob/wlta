import { TagsService } from "~/services";
import type { Route } from "./+types/api-tags.create";

export async function action({ context, request }: Route.ActionArgs) {
  return await new TagsService({ context, request }).createTag();
}
