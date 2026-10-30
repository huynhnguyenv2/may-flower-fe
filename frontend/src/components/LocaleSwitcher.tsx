"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/config";

export function LocaleSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onSelect(next: Locale) {
    if (next === locale || pending) return;
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  return (
    <div
      className="flex rounded-full border border-umber/20 bg-white/80 p-0.5 text-xs font-medium"
      role="group"
      aria-label="Language"
    >
      {(["vi", "en"] as const).map((code) => (
        <button
          key={code}
          type="button"
          disabled={pending}
          onClick={() => onSelect(code)}
          className={`min-w-[2.25rem] rounded-full px-2 py-1 transition-colors ${
            locale === code
              ? "bg-umber text-white shadow-sm"
              : "text-ink/70 hover:text-umber"
          }`}
          aria-pressed={locale === code}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
