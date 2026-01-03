import { TagsService } from "~/service";
import type { Route } from "./+types/api-tags-search";

export async function loader({ context, request }: Route.ActionArgs) {
  return await TagsService.search({ context, request });
}
