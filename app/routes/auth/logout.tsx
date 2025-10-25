import { supabaseContext } from "~/context";
import type { Route } from "./+types/logout";
import { redirect } from "react-router";
import { assertIsLoggedIn } from "~/utils";

export async function loader({ context }: Route.LoaderArgs) {
  const supabase = context.get(supabaseContext);

  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data: sessionResponse } = await supabase.auth.getSession();

    if (sessionResponse.session) {
      const { error } = await supabase.auth.admin.signOut(
        sessionResponse.session.access_token, 
        "global"
      );
  
      if (error) {
        return { error }
      }
  
      return redirect("/");
    }

    return {
      error: "Unknown error logging out",
    }
  }

  return redirect("/");
}

export default function LogoutPage({ loaderData }: Route.ComponentProps) {
  return (
    <pre>
      {JSON.stringify(loaderData?.error, null, 2)}
    </pre>
  );
}