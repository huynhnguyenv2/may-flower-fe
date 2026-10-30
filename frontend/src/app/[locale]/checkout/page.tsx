"use client";

import { useRouter } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import {
  DA_NANG_CITY,
  DA_NANG_DISTRICTS,
  DEFAULT_DELIVERY_ZONE_SLUG,
  formatVnd,
} from "@may-flower/shared";
import { useLocale, useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/Reveal";
import {
  createOrder,
  getDeliverySlots,
  getDeliveryZones,
} from "@/lib/api";
import { readCart, type CartItem } from "@/lib/cart";

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const locale = useLocale();
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [zones, setZones] = useState<{ slug: string; name: string; feeVnd: string }[]>([]);
  const [slots, setSlots] = useState<{ id: string; startTime: string; endTime: string; available: boolean }[]>([]);
  const [zone, setZone] = useState(DEFAULT_DELIVERY_ZONE_SLUG);
  const [date, setDate] = useState("");
  const [slotId, setSlotId] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [customer, setCustomer] = useState({ name: "", phone: "", email: "" });
  const cityDisplay = locale === "en" ? "Da Nang" : DA_NANG_CITY;
  const [recipient, setRecipient] = useState<{
    name: string;
    phone: string;
    addressLine1: string;
    district: string;
    city: string;
    note: string;
  }>({
    name: "",
    phone: "",
    addressLine1: "",
    district: DA_NANG_DISTRICTS[0]!,
    city: DA_NANG_CITY,
    note: "",
  });
  const [messageCard, setMessageCard] = useState("");

  useEffect(() => {
    setItems(readCart());
    void getDeliveryZones().then((loaded) => {
      setZones(loaded);
      setZone((current) => {
        if (loaded.some((z) => z.slug === current)) return current;
        const preferred =
          loaded.find((z) => z.slug === DEFAULT_DELIVERY_ZONE_SLUG) ?? loaded[0];
        return preferred?.slug ?? current;
      });
    });
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDate(tomorrow.toISOString().slice(0, 10));
  }, []);

  useEffect(() => {
    if (!zone || !date) return;
    setSlotId("");
    void getDeliverySlots(zone, date).then(setSlots);
  }, [zone, date]);

  const subtotal = items.reduce((s, i) => s + Number(i.priceVnd) * i.quantity, 0);
  const fee = zones.find((z) => z.slug === zone)?.feeVnd ?? "0";
  const total = subtotal + Number(fee);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) {
      setError(t("emptyCart"));
      return;
    }
    if (!slotId) {
      setError(t("pickSlot"));
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const idempotencyKey = crypto.randomUUID();
      const order = await createOrder(
        {
          customer: {
            name: customer.name,
            phone: customer.phone,
            email: customer.email || undefined,
          },
          recipient: {
            ...recipient,
            note: recipient.note || undefined,
          },
          items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
          messageCard: messageCard || undefined,
          deliveryZoneSlug: zone,
          deliverySlotId: slotId,
        },
        idempotencyKey,
      );
      localStorage.removeItem("mayflower_cart");
      router.push(`/order/${order.orderNumber}/confirmation`);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("orderError"));
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return <p className="text-ink/70">{t("emptyCart")}</p>;
  }

  return (
    <Reveal>
      <div className="max-w-2xl">
        <h1 className="font-display text-3xl">{t("title")}</h1>
        <p className="mt-2 text-sm text-ink/60">{t("deliveryHint", { city: cityDisplay })}</p>
        <form onSubmit={(e) => void onSubmit(e)} className="mt-8 space-y-8">
          <section className="space-y-3">
            <h2 className="font-medium text-umber">{t("yourInfo")}</h2>
            <input
              required
              placeholder={t("name")}
              className="w-full rounded-lg border px-4 py-2 transition focus:ring-2 focus:ring-gold/40"
              value={customer.name}
              onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
            />
            <input
              required
              placeholder={t("phone")}
              className="w-full rounded-lg border px-4 py-2 transition focus:ring-2 focus:ring-gold/40"
              value={customer.phone}
              onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
            />
            <input
              type="email"
              placeholder={t("emailOptional")}
              className="w-full rounded-lg border px-4 py-2 transition focus:ring-2 focus:ring-gold/40"
              value={customer.email}
              onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
            />
          </section>

          <section className="space-y-3">
            <h2 className="font-medium text-umber">{t("recipient")}</h2>
            <input
              required
              placeholder={t("recipientName")}
              className="w-full rounded-lg border px-4 py-2"
              value={recipient.name}
              onChange={(e) => setRecipient({ ...recipient, name: e.target.value })}
            />
            <input
              required
              placeholder={t("recipientPhone")}
              className="w-full rounded-lg border px-4 py-2"
              value={recipient.phone}
              onChange={(e) => setRecipient({ ...recipient, phone: e.target.value })}
            />
            <input
              required
              placeholder={t("addressPlaceholder")}
              className="w-full rounded-lg border px-4 py-2"
              value={recipient.addressLine1}
              onChange={(e) => setRecipient({ ...recipient, addressLine1: e.target.value })}
            />
            <select
              required
              className="w-full rounded-lg border px-4 py-2"
              value={recipient.district}
              onChange={(e) => setRecipient({ ...recipient, district: e.target.value })}
            >
              {DA_NANG_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <input
              readOnly
              className="w-full rounded-lg border bg-ink/5 px-4 py-2 text-ink/70"
              value={cityDisplay}
              aria-label={t("city")}
            />
            <textarea
              placeholder={t("deliveryNote")}
              className="w-full rounded-lg border px-4 py-2"
              value={recipient.note}
              onChange={(e) => setRecipient({ ...recipient, note: e.target.value })}
            />
            <textarea
              placeholder={t("messageCard")}
              className="w-full rounded-lg border px-4 py-2"
              value={messageCard}
              onChange={(e) => setMessageCard(e.target.value)}
            />
            <p className="text-xs text-ink/50">
              {t("landmarkHint")}: {t("landmarksShort")}…
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-medium text-umber">{t("delivery")}</h2>
            <select
              className="w-full rounded-lg border px-4 py-2"
              value={zone}
              onChange={(e) => setZone(e.target.value)}
            >
              {zones.map((z) => (
                <option key={z.slug} value={z.slug}>
                  {z.name} (+{formatVnd(z.feeVnd)})
                </option>
              ))}
            </select>
            <input
              type="date"
              required
              className="w-full rounded-lg border px-4 py-2"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <select
              required
              className="w-full rounded-lg border px-4 py-2"
              value={slotId}
              onChange={(e) => setSlotId(e.target.value)}
            >
              <option value="">{t("slotPlaceholder")}</option>
              {slots
                .filter((s) => s.available)
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.startTime} – {s.endTime}
                  </option>
                ))}
            </select>
          </section>

          <div className="rounded-xl bg-white p-4 ring-1 ring-black/5">
            <p>
              {t("subtotal")}: {formatVnd(String(subtotal))}
            </p>
            <p>
              {t("deliveryFee")}: {formatVnd(fee)}
            </p>
            <p className="mt-2 text-lg font-medium">
              {t("total")}: {formatVnd(String(total))}
            </p>
            <p className="mt-2 text-xs text-ink/50">{t("devPaymentNote")}</p>
          </div>

          {error ? <p className="text-sm text-red-700">{error}</p> : null}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-umber px-8 py-3 text-white transition hover:bg-umber/90 disabled:opacity-50"
          >
            {submitting ? t("submitting") : t("submit")}
          </button>
        </form>
      </div>
    </Reveal>
  );
}
