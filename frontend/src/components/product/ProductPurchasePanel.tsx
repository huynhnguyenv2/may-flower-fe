"use client";

import { useMemo, useState } from "react";
import type { ProductDetail } from "@may-flower/shared";
import { formatVnd } from "@may-flower/shared";
import { useTranslations } from "next-intl";
import { AddToCartButton } from "@/components/AddToCartButton";

export function ProductPurchasePanel({ product }: { product: ProductDetail }) {
  const t = useTranslations("product");
  const availableVariants = product.variants.filter((v) => v.isAvailable);
  const [selectedId, setSelectedId] = useState(
    availableVariants[0]?.id ?? product.variants[0]?.id ?? "",
  );

  const selected = useMemo(
    () => product.variants.find((v) => v.id === selectedId) ?? product.variants[0],
    [product.variants, selectedId],
  );

  if (!selected) return null;

  return (
    <>
      <div className="mt-8">
        <p className="text-xs font-medium uppercase tracking-wide text-ink/50">{t("chooseSize")}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {product.variants.map((v) => {
            const active = v.id === selectedId;
            return (
              <button
                key={v.id}
                type="button"
                disabled={!v.isAvailable}
                onClick={() => setSelectedId(v.id)}
                className={`min-h-[44px] rounded-full px-4 py-2 text-sm transition ${
                  active
                    ? "bg-umber text-white shadow-sm"
                    : "bg-white text-ink ring-1 ring-black/10 hover:ring-umber/40 disabled:cursor-not-allowed disabled:opacity-40"
                }`}
              >
                {v.sizeLabel}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-white p-5 ring-1 ring-black/5">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <p className="font-display text-2xl text-umber">{formatVnd(selected.priceVnd)}</p>
            <p className="mt-1 text-sm text-ink/60">
              {selected.isAvailable
                ? t("stockLeft", { count: selected.availableQuantity })
                : t("availability.unavailable")}
            </p>
          </div>
        </div>
        <div className="mt-4 hidden md:block">
          <AddToCartButton
            variantId={selected.id}
            productSlug={product.slug}
            productName={product.name}
            variantLabel={selected.sizeLabel}
            priceVnd={selected.priceVnd}
            imageUrl={product.imageUrl}
            disabled={!selected.isAvailable}
          />
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gold/25 bg-paper/95 p-4 backdrop-blur-md md:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-ink/60">{selected.sizeLabel}</p>
            <p className="font-display text-lg text-umber">{formatVnd(selected.priceVnd)}</p>
          </div>
          <div className="w-[55%] shrink-0">
            <AddToCartButton
              variantId={selected.id}
              productSlug={product.slug}
              productName={product.name}
              variantLabel={selected.sizeLabel}
              priceVnd={selected.priceVnd}
              imageUrl={product.imageUrl}
              disabled={!selected.isAvailable}
            />
          </div>
        </div>
      </div>
      <div className="h-24 md:hidden" aria-hidden />
    </>
  );
}
