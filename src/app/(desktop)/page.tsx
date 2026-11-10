import { HomePage } from "@/components/site/HomePage";
import { loadBundle } from "@/lib/content";

export const revalidate = 60;

export default async function Page() {
  const bundle = await loadBundle();
  return <HomePage bundle={bundle} />;
}
