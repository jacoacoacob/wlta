import { getAssertIsLoggedIn, type BreadcrumbHandle } from "~/utils";
import type { Route } from "./+types/dashboard-tags-detail";
import { supabaseContext } from "~/context";
import { data, NavLink } from "react-router";
import { Toolbar } from "~/patterns/Toolbar";

export async function loader({ context, params }: Route.LoaderArgs) {
  const user = getAssertIsLoggedIn(context);

  const db = context.get(supabaseContext);

  const { data: tag, error } = await db
    .schema("api")
    .from("tags")
    .select(`
      *,
      categories (
        id,
        name,
        description
      )
    `)
    .eq("user_id", user.id)
    .eq("id", params.tagId)
    .eq("is_archived", false)
    .single();

  if (error) {
    console.warn(error);
  }

  if (!tag) {
    throw data(error, { status: 404 });
  }

  return { tag };
}

export const handle: BreadcrumbHandle = {
  breadcrumb: ({ loaderData }) => {
    const { tag } = loaderData as Route.ComponentProps["loaderData"];

    const { name, id } = tag;

    return {
      name,
      to: `/dashboard/tags/${id}`,
    };
  },
};

export default function DashboardTagsDetail({ loaderData }: Route.ComponentProps) {
  const { tag } = loaderData;

  const { name, description } = tag;
  
  return (
    <div className="flex flex-col gap-4">
      <Toolbar className="dark:bg-transparent bg-transparent outline-none justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          {name}
        </h1>
        <NavLink className="button button--solid" to="edit">
          Edit
        </NavLink>
      </Toolbar>
      <p>{description}</p>

      {!!tag.categories && tag.categories.length > 0 && (
        <section>
          <h2>Categories</h2>
        </section>
      )}
    </div>
  )
}
