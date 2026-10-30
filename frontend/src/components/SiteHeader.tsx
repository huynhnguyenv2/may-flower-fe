"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { MayFlowerLogoLink } from "@/components/MayFlowerLogo";
import { readCart } from "@/lib/cart";

export function SiteHeader() {
  const t = useTranslations("nav");
  const [count, setCount] = useState(0);

  useEffect(() => {
    const refresh = () =>
      setCount(readCart().reduce((n, i) => n + i.quantity, 0));
    refresh();
    window.addEventListener("cart-updated", refresh);
    return () => window.removeEventListener("cart-updated", refresh);
  }, []);

  return (
    <header className="border-b border-gold/30 bg-paper/95 backdrop-blur sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <MayFlowerLogoLink size={40} />
        <nav className="flex items-center gap-4 text-sm text-ink/80 sm:gap-6">
          <LocaleSwitcher />
          <Link href="/collections" className="hover:text-umber">
            {t("collections")}
          </Link>
          <Link href="/find-your-flowers" className="hover:text-umber">
            {t("concierge")}
          </Link>
          <Link href="/journal" className="hover:text-umber hidden sm:inline">
            {t("journal")}
          </Link>
          <Link href="/cart" className="hover:text-umber font-medium">
            {t("cart")} {count > 0 ? `(${count})` : ""}
          </Link>
        </nav>
      </div>
    </header>
  );
}
