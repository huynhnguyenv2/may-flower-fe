"use client";

import { Link } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { formatVnd } from "@may-flower/shared";
import { useTranslations } from "next-intl";
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

  const total = items.reduce(
    (sum, i) => sum + Number(i.priceVnd) * i.quantity,
    0,
  );

  function updateQty(variantId: string, quantity: number) {
    const next = items
      .map((i) => (i.variantId === variantId ? { ...i, quantity } : i))
      .filter((i) => i.quantity > 0);
    writeCart(next);
    setItems(next);
  }

  return (
    <Reveal>
      <div>
        <h1 className="font-display text-3xl">{t("title")}</h1>
        {items.length === 0 ? (
          <p className="mt-6 text-ink/70">
            {t("empty")}{" "}
            <Link href="/collections" className="text-umber underline">
              {t("explore")}
            </Link>
          </p>
        ) : (
          <>
            <ul className="mt-8 space-y-4">
              {items.map((i) => (
                <li
                  key={i.variantId}
                  className="flex flex-col gap-2 rounded-xl bg-white p-4 ring-1 ring-black/5 transition hover:shadow-sm sm:flex-row sm:justify-between"
                >
                  <div>
                    <p className="font-medium">{i.productName}</p>
                    <p className="text-sm text-ink/60">{i.variantLabel}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      min={1}
                      className="w-16 rounded border px-2 py-1"
                      value={i.quantity}
                      onChange={(e) => updateQty(i.variantId, Number(e.target.value))}
                    />
                    <p className="font-medium text-umber">
                      {formatVnd(String(Number(i.priceVnd) * i.quantity))}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-lg font-medium">
              {t("subtotal")}: {formatVnd(String(total))}
            </p>
            <Link
              href="/checkout"
              className="mt-6 inline-block rounded-full bg-umber px-8 py-3 text-sm text-white transition hover:bg-umber/90"
            >
              {t("checkout")}
            </Link>
          </>
        )}
      </div>
    </Reveal>
  );
}
