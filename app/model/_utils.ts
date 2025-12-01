import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { Database } from "~/database.types";

export interface BaseModelParams {
  db: SupabaseClient<Database>;
  user: User;
  isArchived?: boolean;
}