export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { formatVnd } from "@may-flower/shared";
import { AddToCartButton } from "@/components/AddToCartButton";
import { getProduct } from "@/lib/api";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const p = await getProduct(slug);
    return { title: p.name, description: p.story };
  } catch {
    return { title: "Sản phẩm" };
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  let product;
  try {
    product = await getProduct(slug);
  } catch {
    notFound();
  }

  const jsonLd = {
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

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-white ring-1 ring-black/5">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : null}
        </div>
        <div>
          <h1 className="font-display text-4xl text-ink">{product.name}</h1>
          <p className="mt-4 text-lg text-ink/80">{product.story}</p>
          <p className="mt-6 text-sm text-ink/60 leading-relaxed">{product.description}</p>
          <div className="mt-10 space-y-6">
            {product.variants.map((v) => (
              <div
                key={v.id}
                className="flex flex-col gap-3 rounded-xl border border-gold/30 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">{v.sizeLabel}</p>
                  <p className="text-umber">{formatVnd(v.priceVnd)}</p>
                  <p className="text-xs text-ink/50 mt-1">
                    {v.isAvailable ? `Còn ${v.availableQuantity} bó` : "Hết hàng"}
                  </p>
                </div>
                <AddToCartButton
                  variantId={v.id}
                  productSlug={product.slug}
                  productName={product.name}
                  variantLabel={v.sizeLabel}
                  priceVnd={v.priceVnd}
                  imageUrl={product.imageUrl}
                  disabled={!v.isAvailable}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
