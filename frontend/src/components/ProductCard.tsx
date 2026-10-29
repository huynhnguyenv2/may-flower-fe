"use client";

import Link from "next/link";
import Image from "next/image";
import type { ProductSummary } from "@may-flower/shared";
import { formatVnd } from "@may-flower/shared";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/Reveal";

export function ProductCard({
  product,
  revealDelay = 0,
}: {
  product: ProductSummary;
  revealDelay?: number;
}) {
  const t = useTranslations("product");

  return (
    <Reveal delay={revealDelay}>
      <Link
        href={`/products/${product.slug}`}
        className="group block overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/5 transition duration-500 hover:-translate-y-0.5 hover:shadow-md"
      >
        <div className="relative aspect-[4/5] bg-paper">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : null}
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-lg text-ink">{product.name}</h3>
            <AvailabilityDot
              label={product.availabilityLabel}
              title={t(`availability.${product.availabilityLabel}`)}
            />
          </div>
          <p className="mt-1 line-clamp-2 text-sm text-ink/70">{product.story}</p>
          <p className="mt-3 text-sm font-medium text-umber">
            {formatVnd(product.fromPriceVnd)}
          </p>
        </div>
      </Link>
    </Reveal>
  );
}

function AvailabilityDot({ label, title }: { label: ProductSummary["availabilityLabel"]; title: string }) {
  const color =
    label === "available"
      ? "bg-emerald-600"
      : label === "limited"
        ? "bg-amber-500"
        : "bg-neutral-300";
  return <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${color}`} title={title} />;
}
