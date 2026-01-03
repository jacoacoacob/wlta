import type { RouterContextProvider } from "react-router";
import { supabaseContext } from "~/context";

export function getDb(context: Readonly<RouterContextProvider>) {
  return context.get(supabaseContext);
}