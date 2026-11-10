import type { SupabaseClient } from "@supabase/supabase-js";

/** The first authenticated user becomes the admin. Later accounts cannot claim it. */
export async function ensureAdmin(supabase: SupabaseClient) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return { ok: false, message: "Sign in required." };
  }

  const userId = userData.user.id;
  const { data: existing, error: readError } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (readError) return { ok: false, message: readError.message };
  if (existing) return { ok: true, message: "" };

  const { error: insertError } = await supabase.from("admins").insert({ user_id: userId });
  if (!insertError) return { ok: true, message: "" };

  return {
    ok: false,
    message:
      "This account is not the site admin. Turn off public sign-up, create only your user, and sign in first.",
  };
}
