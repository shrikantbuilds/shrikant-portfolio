import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

/** Called by admin after a save so the public site updates without waiting for ISR. */
export async function POST() {
  revalidatePath("/", "layout");
  revalidatePath("/about");
  revalidatePath("/projects");
  revalidatePath("/experience");
  revalidatePath("/skills");
  revalidatePath("/blog");
  revalidatePath("/resume");
  revalidatePath("/contact");
  revalidatePath("/system-design");
  return NextResponse.json({ ok: true });
}
