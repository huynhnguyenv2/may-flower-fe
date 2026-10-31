"use client";

import { useMemo, useState } from "react";
import type { CollectionSummary, ProductSummary } from "@may-flower/shared";
import { useTranslations } from "next-intl";
import { ProductCard } from "@/components/ProductCard";

type SortKey = "name-asc" | "price-asc" | "price-desc";

const PAGE_SIZE = 12;

export function ProductCatalog({
  products,
  collections,
  initialCollection,
  initialFeeling,
}: {
  products: ProductSummary[];
  collections: CollectionSummary[];
  initialCollection?: string;
  initialFeeling?: string;
}) {
  const t = useTranslations("shop");
  const tFeeling = useTranslations("concierge");
  const [query, setQuery] = useState("");
  const [collection, setCollection] = useState(initialCollection ?? "");
  const [feeling, setFeeling] = useState(initialFeeling ?? "");
  const [sort, setSort] = useState<SortKey>("name-asc");
  const [page, setPage] = useState(1);

  const feelings = useMemo(
    () =>
      ["nho-ban", "cam-on", "mung", "xin-loi", "vi-thuong"] as const,
    [],
  );

  const filtered = useMemo(() => {
    let list = [...products];
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.story.toLowerCase().includes(q),
      );
    }
    if (collection) {
      // Client filter when user picks collection — server already filtered if initialCollection set
      // Re-filter not possible without collection membership on product; collection slug filter applied via URL reload
    }
    list.sort((a, b) => {
      if (sort === "name-asc") return a.name.localeCompare(b.name, "vi");
      const pa = Number(a.fromPriceVnd);
      const pb = Number(b.fromPriceVnd);
      return sort === "price-asc" ? pa - pb : pb - pa;
    });
    return list;
  }, [products, query, sort, collection]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function applyCollection(slug: string) {
    setCollection(slug);
    setPage(1);
    const url = new URL(window.location.href);
    if (slug) url.searchParams.set("collection", slug);
    else url.searchParams.delete("collection");
    window.history.replaceState({}, "", url.toString());
    window.location.reload();
  }

  function applyFeeling(slug: string) {
    setFeeling(slug);
    setPage(1);
    const url = new URL(window.location.href);
    if (slug) url.searchParams.set("feeling", slug);
    else url.searchParams.delete("feeling");
    window.history.replaceState({}, "", url.toString());
    window.location.reload();
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-2xl bg-white/70 p-4 ring-1 ring-black/5 backdrop-blur-sm lg:flex-row lg:items-end lg:gap-6">
        <label className="flex-1">
          <span className="text-xs font-medium uppercase tracking-wide text-ink/50">{t("search")}</span>
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder={t("searchPlaceholder")}
            className="mt-1 w-full rounded-xl border border-gold/30 bg-paper px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-gold/40"
          />
        </label>
        <label className="w-full lg:w-48">
          <span className="text-xs font-medium uppercase tracking-wide text-ink/50">{t("sort")}</span>
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value as SortKey);
              setPage(1);
            }}
            className="mt-1 w-full rounded-xl border border-gold/30 bg-paper px-3 py-3"
          >
            <option value="name-asc">{t("sortName")}</option>
            <option value="price-asc">{t("sortPriceAsc")}</option>
            <option value="price-desc">{t("sortPriceDesc")}</option>
          </select>
        </label>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="lg:w-56 shrink-0 space-y-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-ink/50">{t("filterCollection")}</p>
            <div className="mt-2 flex flex-wrap gap-2 lg:flex-col lg:items-stretch">
              <FilterChip active={!collection} onClick={() => applyCollection("")} label={t("all")} />
              {collections.map((c) => (
                <FilterChip
                  key={c.slug}
                  active={collection === c.slug}
                  onClick={() => applyCollection(c.slug)}
                  label={c.title}
                />
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-ink/50">{t("filterFeeling")}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <FilterChip active={!feeling} onClick={() => applyFeeling("")} label={t("all")} />
              {feelings.map((f) => (
                <FilterChip
                  key={f}
                  active={feeling === f}
                  onClick={() => applyFeeling(f)}
                  label={tFeeling(`feelings.${f}`)}
                />
              ))}
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <p className="mb-4 text-sm text-ink/60">
            {t("resultCount", { count: filtered.length })}
          </p>
          {pageItems.length === 0 ? (
            <p className="rounded-xl bg-white/80 p-8 text-center text-ink/70 ring-1 ring-black/5">
              {t("empty")}
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {pageItems.map((p, i) => (
                <ProductCard key={p.slug} product={p} revealDelay={40 * i} />
              ))}
            </div>
          )}
          {totalPages > 1 ? (
            <div className="mt-10 flex items-center justify-center gap-3">
              <button
                type="button"
                disabled={page <= 1}
                className="min-h-[44px] rounded-full border border-umber/30 px-4 text-sm disabled:opacity-40"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                {t("prev")}
              </button>
              <span className="text-sm text-ink/60">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                className="min-h-[44px] rounded-full border border-umber/30 px-4 text-sm disabled:opacity-40"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                {t("next")}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-[40px] rounded-full px-3 py-2 text-left text-sm transition ${
        active
          ? "bg-umber text-white shadow-sm"
          : "bg-white text-ink/80 ring-1 ring-black/8 hover:ring-umber/30"
      }`}
    >
      {label}
    </button>
  );
}
