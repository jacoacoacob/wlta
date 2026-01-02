import { data } from "react-router";
import type { Route } from "./+types/api-tags-categories";
import { supabaseContext } from "~/context";
import { getFormString } from "~/utils/form-data";
import { TagsCategogies } from "~/model/tags-categories";
import { assertIsLoggedIn } from "~/utils";

const STRATEGIES = ["create", "destroy"] as const;

type Strategy = typeof STRATEGIES[number];

/**
 * 
 * Throws an error if `data` is not of one of {@link Strategy}
 */
function assertIsStrategy(data: unknown): asserts data is Strategy {
  if (!STRATEGIES.includes(data as Strategy)) {
    throw new Error(`Unknown strategy. Expected one of ${STRATEGIES}. Recieved ${data}`);
  }
}

export async function action({ context, request }: Route.ActionArgs) {
  try {
    const user = assertIsLoggedIn(context);
  
    const db = context.get(supabaseContext);
  
    const formData = await request.formData();
  
    const strategy = getFormString(formData, "strategy");
  
    assertIsStrategy(strategy);

    const category_id = getFormString(formData, "category_id");
    const tag_id = getFormString(formData, "tag_id");

    if (strategy === "create") {

      const { data: newTagCategory, error } = await TagsCategogies.create({
        db,
        category_id,
        tag_id,
      });

      if (error) {
        throw error;
      }

      return data(newTagCategory, { status: 201 });
    }

    const { error } = await TagsCategogies.destroy({
      db,
      category_id,
      tag_id,
      user
    });

    if (error) {
      throw error;
    }

    return data(null, { status: 204 });
  } catch (error) {
    
    console.warn(error)

    return { error } 
  }
}
