"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { addToCart } from "@/lib/cart";

type Props = {
  variantId: string;
  productSlug: string;
  productName: string;
  variantLabel: string;
  priceVnd: string;
  imageUrl: string | null;
  disabled?: boolean;
};

export function AddToCartButton(props: Props) {
  const t = useTranslations("product");
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      disabled={props.disabled}
      onClick={() => {
        addToCart({
          variantId: props.variantId,
          productSlug: props.productSlug,
          productName: props.productName,
          variantLabel: props.variantLabel,
          priceVnd: props.priceVnd,
          imageUrl: props.imageUrl,
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
      }}
      className="w-full rounded-full bg-umber px-6 py-3 text-sm font-medium text-white transition hover:bg-umber/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
    >
      {added ? t("addedToCart") : t("addToCart")}
    </button>
  );
}
