import { getCollections } from "@/lib/api";

/** Product slugs for sitemap — derived from collection listings. */
export async function getProductsForSitemap(): Promise<string[]> {
  const collections = await getCollections();
  const slugs = new Set<string>();
  for (const c of collections) {
    try {
      const { getCollection } = await import("@/lib/api");
      const detail = await getCollection(c.slug);
      for (const p of detail.products) {
        slugs.add(p.slug);
      }
    } catch {
      /* skip collection */
    }
  }
  return [...slugs];
}
