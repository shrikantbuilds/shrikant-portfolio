import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "./env";

let browserClient: SupabaseClient | null = null;

/** Browser client. Session stays in local storage. The anon key is public; RLS is the lock. */
export function browserSupabase() {
  if (!isSupabaseConfigured()) return null;
  if (!browserClient) {
    browserClient = createClient(supabaseUrl(), supabaseAnonKey());
  }
  return browserClient;
}
