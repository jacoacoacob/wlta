import { createContext } from "react-router";
import * as supabase from "@supabase/supabase-js";
import { authServerMiddleware } from "./middleware/auth.middleware";
import { supbaseServerMiddleware } from "./middleware/supabase.middleware";

/**
 * {@link supbaseServerMiddleware} manages setting session data
 */
export const supabaseContext = createContext<supabase.SupabaseClient>();

/**
 * {@link authServerMiddleware} manages setting session data
 */
export const sessionContext = createContext<supabase.AuthUser | null>(null);
