import type { Route } from "../+types/root";
import { createServerClient, createBrowserClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";
import { supabaseContext } from "../context";
import type { Database } from "~/database.types";

export const supbaseServerMiddleware: Route.MiddlewareFunction = async (
  { request, context },
  next
) => {
  let supabaseSetCookies: string[] = [];

  const supabase = createServerClient<Database>(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY!,
    {
      auth: {
        flowType: "pkce",
      },
      cookies: {
        getAll() {
          return parseCookieHeader(request.headers.get("Cookie") ?? "").reduce<{ name: string; value: string }[]>(
            (accum, { name, value }) => {
              if (typeof value === "string") {
                return accum.concat({ name, value })
              }
            
              return accum;
            },
            []
          );
        },
        setAll(cookies) {
          supabaseSetCookies = cookies.map(({ name, value, options }) => serializeCookieHeader(
            name,
            value,
            options
          ));
        }
      },
      db: {
        schema: "api",
      }
    }
  );

  context.set(supabaseContext, supabase);

  const response = await next();

  supabaseSetCookies.forEach((cookie) => {
    response.headers.append("Set-Cookie", cookie);
  });
}

export const supabaseClientMiddleware: Route.ClientMiddlewareFunction = ({ context }) => {
  const supabase = createBrowserClient<Database>(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY!,
    {
      auth: {
        flowType: "pkce",
      },
      db: {
        schema: "api",
      },
    }
  );

  context.set(supabaseContext, supabase);
}