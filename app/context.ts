import { createContext } from "react-router";
import * as supabase from "@supabase/supabase-js";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { authServerMiddleware } from "./middleware/auth.middleware";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { supbaseServerMiddleware } from "./middleware/supabase.middleware";
import type { Database } from "~/database.types";

/**
 * {@link supbaseServerMiddleware} manages setting session data
 */
export const supabaseContext = createContext<supabase.SupabaseClient<Database, "api">>();

/**
 * {@link authServerMiddleware} manages setting session data
 */
export const sessionContext = createContext<supabase.AuthUser | null>(null);
