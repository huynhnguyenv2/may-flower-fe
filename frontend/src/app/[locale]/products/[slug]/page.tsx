export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
import { getProduct } from "@/lib/api";
import type { Locale } from "@/i18n/config";
import { breadcrumbJsonLd, pageSeo } from "@/lib/seo";

type Props = { params: Promise<{ slug: string; locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  try {
    const p = await getProduct(slug);
    return pageSeo({
      title: p.name,
      description: p.story,
      pathname: `/products/${slug}`,
      locale: locale as Locale,
      image: p.imageUrl,
    });
  } catch {
    return { title: "Sản phẩm" };
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug, locale } = await params;
  let product;
  try {
    product = await getProduct(slug);
  } catch {
    notFound();
  }

  const tNav = await getTranslations({ locale, namespace: "nav" });
  const tProduct = await getTranslations({ locale, namespace: "product" });

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.imageUrl,
    offers: product.variants.map((v) => ({
      "@type": "Offer",
      price: v.priceVnd,
      priceCurrency: "VND",
      availability: v.isAvailable
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    })),
  };
  const breadcrumbs = breadcrumbJsonLd(
    [
      { name: tNav("shop"), path: "/shop" },
      { name: product.name, path: `/products/${slug}` },
    ],
    locale as Locale,
  );

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([productLd, breadcrumbs]) }}
      />
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-ink/50">
        <Link href="/shop" className="hover:text-umber">
          {tNav("shop")}
        </Link>
        <span aria-hidden>/</span>
        <span className="text-ink/80">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <ProductGallery name={product.name} imageUrl={product.imageUrl} />
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-umber/70">{tProduct("studioPiece")}</p>
          <h1 className="font-display mt-2 text-4xl text-ink md:text-5xl">{product.name}</h1>
          <p className="mt-4 text-lg leading-relaxed text-ink/80">{product.story}</p>
          {product.emotionalTags.length > 0 ? (
            <ul className="mt-4 flex flex-wrap gap-2">
              {product.emotionalTags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-gold/15 px-3 py-1 text-xs font-medium text-umber"
                >
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
          <p className="mt-6 text-sm leading-relaxed text-ink/65">{product.description}</p>
          <ProductPurchasePanel product={product} />
        </div>
      </div>
    </div>
  );
}
