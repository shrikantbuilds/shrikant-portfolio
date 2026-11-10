import { supabaseUrl } from "./supabase/env";

/** Public Storage URL. Files are world-readable; only an admin can upload them. */
export function mediaUrl(path: string | null | undefined) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base = supabaseUrl();
  if (!base) return "";
  const encoded = path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `${base}/storage/v1/object/public/media/${encoded}`;
}
