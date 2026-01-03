import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { Database } from "~/database.types";

export interface BaseModelParams {
  db: SupabaseClient<Database>;
  user: User;
  is_archived?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ModelData<Query extends (...args: any) => any> = Awaited<ReturnType<Query>>["data"];

export type ApiTableRow<Table extends keyof Database["api"]["Tables"]> = Database["api"]["Tables"][Table]["Row"];
