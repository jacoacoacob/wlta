import { createContext } from "react-router";
import * as supabase from "@supabase/supabase-js";
import { authServerMiddleware } from "./middleware/auth.middleware";
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
