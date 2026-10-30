import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { JOURNAL_POSTS } from "@/lib/journal-posts";
import { localizedUrl } from "@/lib/seo";
import { getCollections } from "@/lib/api";
import { getProductsForSitemap } from "@/lib/sitemap-data";

export const dynamic = "force-dynamic";

const STATIC_PATHS = [
  "/",
  "/collections",
  "/find-your-flowers",
  "/journal",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  let productSlugs: string[] = [];
  let collectionSlugs: string[] = [];

  try {
    const collections = await getCollections();
    collectionSlugs = collections.map((c) => c.slug);
    productSlugs = await getProductsForSitemap();
  } catch {
    // API unavailable at build — still emit static routes
  }

  const paths = [
    ...STATIC_PATHS,
    ...collectionSlugs.map((slug) => `/collections/${slug}` as const),
    ...productSlugs.map((slug) => `/products/${slug}` as const),
    ...JOURNAL_POSTS.map((p) => `/journal/${p.slug}` as const),
  ];

  for (const pathname of paths) {
    entries.push({
      url: localizedUrl(routing.defaultLocale, pathname),
      lastModified: now,
      changeFrequency: pathname === "/" ? "daily" : "weekly",
      priority: pathname === "/" ? 1 : pathname.startsWith("/products/") ? 0.8 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, localizedUrl(l, pathname)]),
        ),
      },
    });
  }

  return entries;
}
