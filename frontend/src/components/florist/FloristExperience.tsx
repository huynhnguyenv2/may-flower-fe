"use client";

import { useCallback, useEffect, useState } from "react";
import type { FloristConcept, FloristSessionSummary } from "@may-flower/shared";
import { formatVnd } from "@may-flower/shared";
import { useTranslations } from "next-intl";
import {
  createFloristSession,
  fetchFloristConcepts,
  fetchFloristSession,
  fetchFloristSummary,
  selectFloristConcept,
  sendFloristMessage,
  submitFloristRequest,
  getDeliverySlots,
  getDeliveryZones,
} from "@/lib/api";

const SESSION_KEY = "mayflower_florist_session";

type ChatLine = { role: "user" | "assistant"; content: string };

export function FloristExperience() {
  const t = useTranslations("florist");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [chat, setChat] = useState<ChatLine[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [concepts, setConcepts] = useState<FloristConcept[]>([]);
  const [summary, setSummary] = useState<FloristSessionSummary | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [requestNumber, setRequestNumber] = useState<string | null>(null);

  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    recipientName: "",
    recipientPhone: "",
    addressLine1: "",
    district: "",
    city: "Đà Nẵng",
    messageCard: "",
    deliveryZoneSlug: "",
    deliverySlotId: "",
  });

  const refreshSummary = useCallback(async (id: string) => {
    const s = await fetchFloristSummary(id);
    setSummary(s);
  }, []);

  useEffect(() => {
    void (async () => {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) {
        const recovered = await fetchFloristSession(stored);
        if (recovered) {
          setSessionId(stored);
          setChat(
            recovered.messages.map((m) => ({
              role: m.role === "assistant" ? "assistant" : "user",
              content: m.content,
            })),
          );
          setSummary(recovered.summary);
          const c = await fetchFloristConcepts(stored);
          setConcepts(c);
          return;
        }
      }
      const session = await createFloristSession();
      localStorage.setItem(SESSION_KEY, session.id);
      setSessionId(session.id);
      setChat([
        {
          role: "assistant",
          content: t("welcome"),
        },
      ]);
    })();
  }, [t]);

  async function onSend(e: React.FormEvent) {
    e.preventDefault();
    if (!sessionId || !input.trim() || loading) return;
    const text = input.trim();
    setInput("");
    setChat((c) => [...c, { role: "user", content: text }]);
    setLoading(true);
    try {
      const reply = await sendFloristMessage(sessionId, text);
      setChat((c) => [...c, { role: "assistant", content: reply.message }]);
      if (reply.effects?.concepts?.length) {
        setConcepts(reply.effects.concepts);
      } else {
        const c = await fetchFloristConcepts(sessionId);
        if (c.length) setConcepts(c);
      }
      if (reply.effects?.summary) {
        setSummary(reply.effects.summary);
      } else {
        await refreshSummary(sessionId);
      }
    } finally {
      setLoading(false);
    }
  }

  async function onSelectConcept(conceptId: string) {
    if (!sessionId) return;
    setLoading(true);
    try {
      const { summary: s } = await selectFloristConcept(sessionId, conceptId);
      setSummary(s);
      const c = await fetchFloristConcepts(sessionId);
      setConcepts(c);
    } finally {
      setLoading(false);
    }
  }

  async function openConfirm() {
    if (!sessionId) return;
    await refreshSummary(sessionId);
    const zones = await getDeliveryZones();
    if (zones[0]) {
      setForm((f) => ({ ...f, deliveryZoneSlug: zones[0]!.slug }));
      const date = new Date().toISOString().slice(0, 10);
      const slots = await getDeliverySlots(zones[0]!.slug, date);
      if (slots[0]) {
        setForm((f) => ({ ...f, deliverySlotId: slots[0]!.id }));
      }
    }
    setShowConfirm(true);
  }

  async function onSubmitRequest() {
    if (!sessionId) return;
    setSubmitting(true);
    try {
      const result = await submitFloristRequest(sessionId, {
        confirm: true,
        customer: {
          name: form.customerName,
          phone: form.customerPhone,
          email: form.customerEmail || undefined,
        },
        recipient: {
          name: form.recipientName,
          phone: form.recipientPhone,
          addressLine1: form.addressLine1,
          district: form.district,
          city: form.city,
        },
        deliveryZoneSlug: form.deliveryZoneSlug,
        deliverySlotId: form.deliverySlotId,
        messageCard: form.messageCard || undefined,
      });
      setRequestNumber(result.requestNumber);
      setShowConfirm(false);
    } finally {
      setSubmitting(false);
    }
  }

  if (requestNumber) {
    return (
      <div className="rounded-xl bg-white p-8 ring-1 ring-black/5">
        <h2 className="font-display text-2xl text-umber">{t("submittedTitle")}</h2>
        <p className="mt-2 text-ink/70">{t("submittedBody", { requestNumber })}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr_320px]">
      <section className="flex min-h-[420px] flex-col rounded-xl bg-white p-4 ring-1 ring-black/5">
        <h2 className="font-display text-lg text-ink mb-3">{t("chatTitle")}</h2>
        <div className="flex-1 space-y-3 overflow-y-auto pr-1">
          {chat.map((line, i) => (
            <div
              key={i}
              className={`max-w-[90%] rounded-2xl px-4 py-2 text-sm ${
                line.role === "user"
                  ? "ml-auto bg-umber text-white"
                  : "bg-paper text-ink ring-1 ring-gold/30"
              }`}
            >
              {line.content}
            </div>
          ))}
        </div>
        <form onSubmit={(e) => void onSend(e)} className="mt-4 flex gap-2">
          <input
            className="min-h-[44px] flex-1 rounded-lg border border-gold/40 px-3"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("inputPlaceholder")}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-full bg-umber px-5 py-2 text-sm text-white disabled:opacity-40"
          >
            {loading ? t("sending") : t("send")}
          </button>
        </form>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg text-ink">{t("designsTitle")}</h2>
        {concepts.length === 0 ? (
          <p className="text-sm text-ink/60">{t("noDesigns")}</p>
        ) : (
          concepts.map((c) => (
            <article key={c.id} className="rounded-xl bg-white p-4 ring-1 ring-black/5">
              {c.image ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.image.url}
                    alt=""
                    className="mb-3 aspect-[4/3] w-full rounded-lg object-cover"
                  />
                  <p className="text-xs text-ink/50">{c.image.disclaimer}</p>
                </>
              ) : null}
              <p className="mt-2 font-medium">{c.name}</p>
              <p className="text-sm text-ink/70">{c.descriptionVi}</p>
              <p className="mt-1 text-sm text-umber">{formatVnd(c.estimatedSubtotalVnd)}</p>
              <button
                type="button"
                disabled={loading || c.status === "selected"}
                onClick={() => void onSelectConcept(c.id)}
                className="mt-3 text-sm font-medium text-umber underline disabled:opacity-40"
              >
                {c.status === "selected" ? t("selected") : t("selectDesign")}
              </button>
            </article>
          ))
        )}
      </section>

      <aside className="sticky top-24 h-fit rounded-xl bg-white p-4 ring-1 ring-black/5">
        <h2 className="font-display text-lg text-ink">{t("summaryTitle")}</h2>
        {summary?.priceBreakdown ? (
          <ul className="mt-3 space-y-1 text-sm">
            {summary.priceBreakdown.lines.map((line) => (
              <li key={line.label} className="flex justify-between gap-2">
                <span className="text-ink/70">{line.label}</span>
                <span>{formatVnd(line.amountVnd)}</span>
              </li>
            ))}
            <li className="flex justify-between border-t border-gold/30 pt-2 font-medium">
              <span>{t("total")}</span>
              <span className="text-umber">{formatVnd(summary.priceBreakdown.totalVnd)}</span>
            </li>
          </ul>
        ) : (
          <p className="mt-2 text-sm text-ink/60">{t("summaryEmpty")}</p>
        )}

        {summary?.configuration ? (
          <button
            type="button"
            onClick={() => void openConfirm()}
            className="mt-4 w-full rounded-full bg-umber py-3 text-sm text-white"
          >
            {t("confirmRequest")}
          </button>
        ) : null}
      </aside>

      {showConfirm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6">
            <h3 className="font-display text-xl">{t("confirmModalTitle")}</h3>
            <p className="mt-1 text-sm text-ink/60">{t("confirmDisclaimer")}</p>
            <div className="mt-4 space-y-3">
              <input
                className="w-full rounded-lg border px-3 py-2 text-sm"
                placeholder={t("yourName")}
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              />
              <input
                className="w-full rounded-lg border px-3 py-2 text-sm"
                placeholder={t("yourPhone")}
                value={form.customerPhone}
                onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
              />
              <input
                className="w-full rounded-lg border px-3 py-2 text-sm"
                placeholder={t("recipientName")}
                value={form.recipientName}
                onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
              />
              <input
                className="w-full rounded-lg border px-3 py-2 text-sm"
                placeholder={t("recipientPhone")}
                value={form.recipientPhone}
                onChange={(e) => setForm({ ...form, recipientPhone: e.target.value })}
              />
              <input
                className="w-full rounded-lg border px-3 py-2 text-sm"
                placeholder={t("address")}
                value={form.addressLine1}
                onChange={(e) => setForm({ ...form, addressLine1: e.target.value })}
              />
              <input
                className="w-full rounded-lg border px-3 py-2 text-sm"
                placeholder={t("district")}
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
              />
            </div>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                className="flex-1 rounded-full border py-2 text-sm"
                onClick={() => setShowConfirm(false)}
              >
                {t("cancel")}
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => void onSubmitRequest()}
                className="flex-1 rounded-full bg-umber py-2 text-sm text-white disabled:opacity-50"
              >
                {submitting ? t("submitting") : t("submit")}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
