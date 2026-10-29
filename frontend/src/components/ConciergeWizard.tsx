"use client";

import { useState } from "react";
import type { RecommendationTier } from "@may-flower/shared";
import { formatVnd } from "@may-flower/shared";
import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  createConciergeSession,
  recommendConcierge,
} from "@/lib/api";
import { addToCart } from "@/lib/cart";

const feelingSlugs = ["nho-ban", "cam-on", "mung", "xin-loi", "vi-thuong"] as const;

export function ConciergeWizard() {
  const t = useTranslations("concierge");
  const tProduct = useTranslations("product");
  const [step, setStep] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [recs, setRecs] = useState<RecommendationTier[]>([]);
  const [form, setForm] = useState({
    recipient: "",
    occasion: "",
    feeling: "cam-on",
    budgetVnd: "1000000",
    colors: "",
  });

  async function startSession() {
    const s = await createConciergeSession();
    setSessionId(s.id);
    setStep(1);
  }

  async function submitRecommendations() {
    if (!sessionId) return;
    setLoading(true);
    try {
      const recommendations = await recommendConcierge(sessionId, form);
      setRecs(recommendations);
      setStep(5);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-8 flex gap-2">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded ${i <= step ? "bg-umber" : "bg-gold/40"}`}
          />
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-4">
          <h2 className="font-display text-2xl">{t("introTitle")}</h2>
          <p className="text-ink/70">{t("introBody")}</p>
          <button
            type="button"
            onClick={() => void startSession()}
            className="rounded-full bg-umber px-6 py-3 text-sm text-white transition hover:bg-umber/90"
          >
            {t("start")}
          </button>
        </div>
      )}

      {step === 1 && (
        <Field
          label={t("recipientLabel")}
          value={form.recipient}
          onChange={(v) => setForm({ ...form, recipient: v })}
          onNext={() => setStep(2)}
          continueLabel={t("continue")}
        />
      )}
      {step === 2 && (
        <Field
          label={t("occasionLabel")}
          value={form.occasion}
          onChange={(v) => setForm({ ...form, occasion: v })}
          onNext={() => setStep(3)}
          continueLabel={t("continue")}
        />
      )}
      {step === 3 && (
        <div className="space-y-4">
          <label className="block text-sm font-medium">{t("feelingLabel")}</label>
          <select
            className="w-full rounded-lg border border-gold/40 bg-white px-4 py-3"
            value={form.feeling}
            onChange={(e) => setForm({ ...form, feeling: e.target.value })}
          >
            {feelingSlugs.map((slug) => (
              <option key={slug} value={slug}>
                {t(`feelings.${slug}`)}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setStep(4)}
            className="rounded-full bg-umber px-6 py-3 text-sm text-white"
          >
            {t("continue")}
          </button>
        </div>
      )}
      {step === 4 && (
        <div className="space-y-4">
          <label className="block text-sm font-medium">{t("budgetLabel")}</label>
          <input
            type="number"
            className="w-full rounded-lg border border-gold/40 bg-white px-4 py-3"
            value={form.budgetVnd}
            onChange={(e) => setForm({ ...form, budgetVnd: e.target.value })}
          />
          <button
            type="button"
            disabled={loading}
            onClick={() => void submitRecommendations()}
            className="rounded-full bg-umber px-6 py-3 text-sm text-white disabled:opacity-50"
          >
            {loading ? t("loading") : t("seeSuggestions")}
          </button>
        </div>
      )}

      {step === 5 && (
        <div className="space-y-6">
          <h2 className="font-display text-2xl">{t("resultsTitle")}</h2>
          {recs.length === 0 ? (
            <p className="text-ink/70">{t("noResults")}</p>
          ) : (
            recs.map((r) => (
              <div key={r.tier} className="rounded-xl bg-white p-5 ring-1 ring-black/5">
                <p className="text-xs uppercase tracking-widest text-umber">{r.tierLabel}</p>
                <p className="font-display mt-1 text-xl">{r.product.name}</p>
                <p className="text-sm text-ink/70">{r.product.story}</p>
                <p className="mt-2 font-medium text-umber">{formatVnd(r.priceVnd)}</p>
                <div className="mt-4 flex gap-3">
                  <Link
                    href={`/products/${r.product.slug}`}
                    className="text-sm underline text-umber"
                  >
                    {t("viewDetail")}
                  </Link>
                  <button
                    type="button"
                    className="text-sm font-medium text-umber"
                    onClick={() => {
                      addToCart({
                        variantId: r.variantId,
                        productSlug: r.product.slug,
                        productName: r.product.name,
                        variantLabel: r.tierLabel,
                        priceVnd: r.priceVnd,
                        imageUrl: r.product.imageUrl,
                      });
                    }}
                  >
                    {tProduct("addToCart")}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  onNext,
  continueLabel,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
  continueLabel: string;
}) {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium">{label}</label>
      <input
        className="w-full rounded-lg border border-gold/40 bg-white px-4 py-3"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        type="button"
        disabled={!value.trim()}
        onClick={onNext}
        className="rounded-full bg-umber px-6 py-3 text-sm text-white disabled:opacity-40"
      >
        {continueLabel}
      </button>
    </div>
  );
}
