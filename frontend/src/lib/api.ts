import {
  type CollectionSummary,
  type ProductDetail,
  type ProductSummary,
  collectionDetailSchema,
  collectionSummarySchema,
  conciergeAnswersSchema,
  createOrderRequestSchema,
  deliverySlotSchema,
  deliveryZoneSchema,
  orderResponseSchema,
  productDetailSchema,
  productSummarySchema,
  recommendationTierSchema,
  type ConciergeAnswers,
} from "@may-flower/shared";
import { z } from "zod";

const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/v1";

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    next: init?.method ? undefined : { revalidate: 60 },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body}`);
  }
  return res.json() as Promise<T>;
}

const wrap = <S extends z.ZodTypeAny>(schema: S, data: unknown) =>
  schema.parse(data);

export async function getCollections(): Promise<CollectionSummary[]> {
  const json = await fetchJson<{ data: unknown[] }>("/collections");
  return json.data.map((d) => wrap(collectionSummarySchema, d));
}

export async function getCollection(slug: string): Promise<z.infer<typeof collectionDetailSchema>> {
  const json = await fetchJson<{ data: unknown }>(`/collections/${slug}`);
  return wrap(collectionDetailSchema, json.data);
}

export async function getFeaturedProducts(): Promise<ProductSummary[]> {
  const json = await fetchJson<{ data: unknown[] }>("/products/featured/list");
  return json.data.map((d) => wrap(productSummarySchema, d));
}

export async function getProduct(slug: string): Promise<ProductDetail> {
  const json = await fetchJson<{ data: unknown }>(`/products/${slug}`);
  return wrap(productDetailSchema, json.data);
}

export async function createConciergeSession() {
  const json = await fetchJson<{ data: { id: string } }>("/concierge/sessions", {
    method: "POST",
  });
  return json.data;
}

export async function recommendConcierge(sessionId: string, answers: ConciergeAnswers) {
  conciergeAnswersSchema.parse(answers);
  const json = await fetchJson<{ data: { recommendations: unknown[] } }>(
    `/concierge/sessions/${sessionId}/recommend`,
    { method: "POST", body: JSON.stringify(answers) },
  );
  return json.data.recommendations.map((r) => wrap(recommendationTierSchema, r));
}

export async function getDeliveryZones() {
  const json = await fetchJson<{ data: unknown[] }>("/delivery/zones");
  return json.data.map((d) => wrap(deliveryZoneSchema, d));
}

export async function getDeliverySlots(zone: string, date: string) {
  const json = await fetchJson<{ data: unknown[] }>(
    `/delivery/slots?zone=${encodeURIComponent(zone)}&date=${encodeURIComponent(date)}`,
  );
  return json.data.map((d) => wrap(deliverySlotSchema, d));
}

export async function createOrder(
  body: z.infer<typeof createOrderRequestSchema>,
  idempotencyKey: string,
) {
  createOrderRequestSchema.parse(body);
  const json = await fetchJson<{ data: unknown }>("/orders", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Idempotency-Key": idempotencyKey },
    cache: "no-store",
  });
  return wrap(orderResponseSchema, json.data);
}

export async function getOrder(orderNumber: string) {
  const json = await fetchJson<{ data: unknown }>(`/orders/${orderNumber}`, {
    cache: "no-store",
  });
  return wrap(orderResponseSchema, json.data);
}
