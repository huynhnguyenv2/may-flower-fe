"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { MayFlowerLogoLink } from "@/components/MayFlowerLogo";
import { Container } from "@/components/layout/Container";
import { readCart } from "@/lib/cart";

const NAV_LINKS = [
  { href: "/shop" as const, key: "shop" as const },
  { href: "/collections" as const, key: "collections" as const },
  { href: "/find-your-flowers" as const, key: "concierge" as const },
  { href: "/journal" as const, key: "journal" as const },
];

export function SiteHeader() {
  const t = useTranslations("nav");
  const [count, setCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const refresh = () => setCount(readCart().reduce((n, i) => n + i.quantity, 0));
    refresh();
    window.addEventListener("cart-updated", refresh);
    return () => window.removeEventListener("cart-updated", refresh);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-gold/25 bg-paper/90 backdrop-blur-md">
      <Container className="flex items-center justify-between py-3 md:py-4">
        <MayFlowerLogoLink size={40} />

        <nav className="hidden items-center gap-6 text-sm text-ink/80 md:flex">
          {NAV_LINKS.map((item) => (
            <Link key={item.key} href={item.href} className="transition hover:text-umber">
              {t(item.key)}
            </Link>
          ))}
          <LocaleSwitcher />
          <Link href="/cart" className="font-medium text-ink transition hover:text-umber">
            {t("cart")} {count > 0 ? `(${count})` : ""}
          </Link>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/cart"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-sm font-medium text-ink"
            aria-label={t("cart")}
          >
            {t("cart")}
            {count > 0 ? ` (${count})` : ""}
          </Link>
          <button
            type="button"
            className="inline-flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1.5 rounded-lg px-2"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? t("menuClose") : t("menuOpen")}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span
              className={`h-0.5 w-5 bg-ink transition ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
            />
            <span className={`h-0.5 w-5 bg-ink transition ${menuOpen ? "opacity-0" : ""}`} />
            <span
              className={`h-0.5 w-5 bg-ink transition ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </button>
        </div>
      </Container>

      {menuOpen ? (
        <div className="fixed inset-0 top-[57px] z-40 bg-ink/40 md:hidden" onClick={() => setMenuOpen(false)}>
          <nav
            className="border-b border-gold/20 bg-paper px-4 py-4 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <ul className="space-y-1">
              {NAV_LINKS.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="flex min-h-[48px] items-center rounded-lg px-3 text-base text-ink/90 hover:bg-umber/5"
                    onClick={() => setMenuOpen(false)}
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <LocaleSwitcher />
              </li>
            </ul>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
