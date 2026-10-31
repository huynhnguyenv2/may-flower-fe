"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { formatVnd } from "@may-flower/shared";
import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/motion/Reveal";
import { readCart, writeCart, type CartItem } from "@/lib/cart";

export default function CartPage() {
  const t = useTranslations("cart");
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(readCart());
    const refresh = () => setItems(readCart());
    window.addEventListener("cart-updated", refresh);
    return () => window.removeEventListener("cart-updated", refresh);
  }, []);

  const total = items.reduce((sum, i) => sum + Number(i.priceVnd) * i.quantity, 0);

  function updateQty(variantId: string, quantity: number) {
    const next = items
      .map((i) => (i.variantId === variantId ? { ...i, quantity } : i))
      .filter((i) => i.quantity > 0);
    writeCart(next);
    setItems(next);
  }

  return (
    <Reveal>
      <div className="lg:grid lg:grid-cols-3 lg:gap-10">
        <div className="lg:col-span-2">
          <h1 className="font-display text-3xl md:text-4xl">{t("title")}</h1>
          {items.length === 0 ? (
            <p className="mt-8 text-ink/70">
              {t("empty")}{" "}
              <Link href="/shop" className="text-umber underline">
                {t("exploreShop")}
              </Link>
            </p>
          ) : (
            <ul className="mt-8 space-y-4">
              {items.map((i) => (
                <li
                  key={i.variantId}
                  className="flex gap-4 rounded-2xl bg-white p-4 ring-1 ring-black/5"
                >
                  {i.imageUrl ? (
                    <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg">
                      <Image src={i.imageUrl} alt="" fill className="object-cover" sizes="64px" />
                    </div>
                  ) : null}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{i.productName}</p>
                    <p className="text-sm text-ink/60">{i.variantLabel}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-4">
                      <label className="flex items-center gap-2 text-sm">
                        <span className="text-ink/50">Qty</span>
                        <input
                          type="number"
                          min={1}
                          className="w-16 rounded-lg border border-gold/30 px-2 py-2 text-base"
                          value={i.quantity}
                          onChange={(e) => updateQty(i.variantId, Number(e.target.value))}
                        />
                      </label>
                      <p className="font-medium text-umber">
                        {formatVnd(String(Number(i.priceVnd) * i.quantity))}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 ? (
          <aside className="mt-10 lg:mt-16">
            <div className="sticky top-24 rounded-2xl bg-white p-6 ring-1 ring-black/5">
              <p className="text-sm text-ink/60">{t("subtotal")}</p>
              <p className="font-display mt-1 text-3xl text-umber">{formatVnd(String(total))}</p>
              <p className="mt-2 text-xs text-ink/50">{t("deliveryNote")}</p>
              <ButtonLink href="/checkout" className="mt-6 w-full">
                {t("checkout")}
              </ButtonLink>
              <Link href="/shop" className="mt-4 block text-center text-sm text-umber hover:underline">
                {t("continueShopping")}
              </Link>
            </div>
          </aside>
        ) : null}
      </div>
    </Reveal>
  );
}
