/** Ask Next.js to refresh public pages after an admin save. */
export async function refreshPublicSite() {
  try {
    await fetch("/api/revalidate", { method: "POST" });
  } catch {
    // Save already succeeded; cache will catch up on the next revalidate window.
  }
}
