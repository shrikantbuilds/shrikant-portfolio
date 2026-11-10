import { redirect } from "next/navigation";

/** Trash was part of the old OS shell. Public nav no longer includes it. */
export default function TrashRedirectPage() {
  redirect("/");
}
