import type { Route } from "../+types/root";
import { createServerClient, createBrowserClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";
import { supabaseContext } from "../context";

export const supbaseServerMiddleware: Route.MiddlewareFunction = async (
  { request, context },
  next
) => {
  let supabaseSetCookies: string[] = [];

  const supabase = createServerClient(
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
  const supabase = createBrowserClient(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY!,
    {
      auth: {
        flowType: "pkce",
      }
    }
  );

  console.log(supabase.auth)

  context.set(supabaseContext, supabase);
}