import type { Metadata } from "next";
import { defaultLocale, type Locale } from "@/i18n/config";
import { routing } from "@/i18n/routing";

export function siteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3100";
}

/** Path without locale prefix, e.g. `/products/binh-minh-ua`. */
export function localizedUrl(locale: Locale, pathname: string): string {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const base = siteUrl();
  if (locale === routing.defaultLocale) {
    return path === "/" ? base : `${base}${path}`;
  }
  return path === "/" ? `${base}/${locale}` : `${base}/${locale}${path}`;
}

export function languageAlternates(pathname: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = localizedUrl(locale, pathname);
  }
  languages["x-default"] = localizedUrl(defaultLocale, pathname);
  return languages;
}

export function pageSeo(input: {
  title: string;
  description?: string;
  pathname: string;
  locale: Locale;
  image?: string | null;
}): Metadata {
  const { title, description, pathname, locale, image } = input;
  const canonical = localizedUrl(locale, pathname);
  const ogImage = image?.startsWith("http") ? image : image ? `${siteUrl()}${image}` : undefined;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: languageAlternates(pathname),
    },
    openGraph: {
      title,
      description,
      url: canonical,
      locale: locale === "vi" ? "vi_VN" : "en_US",
      siteName: "nau.fleur",
      type: "website",
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
  locale: Locale,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: localizedUrl(locale, item.path),
    })),
  };
}
