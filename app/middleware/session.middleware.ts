import { sessionContext, supabaseContext } from "~/context";
import type { Route } from "../+types/root";


export const sessionServerMiddleware: Route.MiddlewareFunction = async ({
  context
}) => {
  const supabase = context.get(supabaseContext);

  const { data } = await supabase.auth.getUser();

  context.set(sessionContext, data.user);
}

export const sessionClientMiddleware: Route.ClientMiddlewareFunction = async ({
  context
}) => {
  const supabase = context.get(supabaseContext);

  const { data } = await supabase.auth.getUser();

  context.set(sessionContext, data.user);
}