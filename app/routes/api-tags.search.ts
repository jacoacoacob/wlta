import { TagsService } from "~/services";
import type { Route } from "./+types/api-tags.search";

export async function loader({ context, request }: Route.ActionArgs) {
  return await new TagsService({ context, request }).searchTags();
}
