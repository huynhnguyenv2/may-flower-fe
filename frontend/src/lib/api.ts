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
  supportReplySchema,
  floristMessageReplySchema,
  floristConceptSchema,
  floristSessionSummarySchema,
  customOrderRequestResponseSchema,
  submitCustomOrderRequestSchema,
  floristCreateSessionSchema,
  floristSendMessageSchema,
  floristUpdateSessionSchema,
  type ConciergeAnswers,
  type SupportReply,
  type FloristConcept,
  type FloristSessionSummary,
  type SubmitCustomOrderRequest,
} from "@may-flower/shared";
import { z } from "zod";

function apiBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  if (url) return url;
  if (process.env.VERCEL === "1" || process.env.NODE_ENV === "production") {
    throw new Error(
      "Missing NEXT_PUBLIC_API_URL. Set it in Vercel to your API, e.g. https://may-flower-be.onrender.com/v1",
    );
  }
  return "http://localhost:3101/v1";
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${apiBaseUrl()}${path}`, {
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

export type ProductListFilters = {
  collection?: string;
  feeling?: string;
  minPrice?: string;
  maxPrice?: string;
};

export async function listProducts(filters: ProductListFilters = {}): Promise<ProductSummary[]> {
  const params = new URLSearchParams();
  if (filters.collection) params.set("collection", filters.collection);
  if (filters.feeling) params.set("feeling", filters.feeling);
  if (filters.minPrice) params.set("minPrice", filters.minPrice);
  if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
  const qs = params.toString();
  const json = await fetchJson<{ data: unknown[] }>(`/products${qs ? `?${qs}` : ""}`);
  return json.data.map((d) => wrap(productSummarySchema, d));
}

export async function getProduct(slug: string): Promise<ProductDetail> {
  const json = await fetchJson<{ data: unknown }>(`/products/${slug}`);
  return wrap(productDetailSchema, json.data);
}

export async function createConciergeSession() {
  const json = await fetchJson<{ data: { id: string } }>("/concierge/sessions", {
    method: "POST",
    body: "{}",
  });
  return json.data;
}

export async function createSupportSession(locale: "vi" | "en") {
  const json = await fetchJson<{ data: { id: string } }>("/support/sessions", {
    method: "POST",
    body: JSON.stringify({ locale }),
  });
  return json.data;
}

export async function sendSupportMessage(sessionId: string, content: string): Promise<SupportReply> {
  const json = await fetchJson<{ data: unknown }>(
    `/support/sessions/${sessionId}/messages`,
    { method: "POST", body: JSON.stringify({ content }) },
  );
  return wrap(supportReplySchema, json.data);
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

export async function createFloristSession(locale: "vi" | "en" = "vi") {
  floristCreateSessionSchema.parse({ locale });
  const json = await fetchJson<{ data: { id: string } }>("/florist/sessions", {
    method: "POST",
    body: JSON.stringify({ locale }),
    cache: "no-store",
  });
  return json.data;
}

export async function fetchFloristSession(id: string) {
  try {
    const json = await fetchJson<{
      data: {
        messages: { role: string; content: string }[];
        summary: FloristSessionSummary;
      };
    }>(`/florist/sessions/${id}`, { cache: "no-store" });
    return {
      messages: json.data.messages,
      summary: wrap(floristSessionSummarySchema, json.data.summary),
    };
  } catch {
    return null;
  }
}

export async function sendFloristMessage(sessionId: string, content: string) {
  floristSendMessageSchema.parse({ content });
  const json = await fetchJson<{ data: unknown }>(
    `/florist/sessions/${sessionId}/messages`,
    { method: "POST", body: JSON.stringify({ content }), cache: "no-store" },
  );
  return wrap(floristMessageReplySchema, json.data);
}

export async function fetchFloristConcepts(sessionId: string): Promise<FloristConcept[]> {
  const json = await fetchJson<{ data: unknown[] }>(
    `/florist/sessions/${sessionId}/concepts`,
    { cache: "no-store" },
  );
  return json.data.map((d) => wrap(floristConceptSchema, d));
}

export async function selectFloristConcept(sessionId: string, conceptId: string) {
  const json = await fetchJson<{ data: { summary: unknown } }>(
    `/florist/sessions/${sessionId}/concepts/${conceptId}/select`,
    { method: "POST", body: "{}", cache: "no-store" },
  );
  return { summary: wrap(floristSessionSummarySchema, json.data.summary) };
}

export async function fetchFloristSummary(sessionId: string): Promise<FloristSessionSummary> {
  const json = await fetchJson<{ data: unknown }>(
    `/florist/sessions/${sessionId}/summary`,
    { cache: "no-store" },
  );
  return wrap(floristSessionSummarySchema, json.data);
}

export async function updateFloristSession(
  sessionId: string,
  body: z.infer<typeof floristUpdateSessionSchema>,
) {
  floristUpdateSessionSchema.parse(body);
  const json = await fetchJson<{ data: unknown }>(`/florist/sessions/${sessionId}`, {
    method: "PATCH",
    body: JSON.stringify(body),
    cache: "no-store",
  });
  return wrap(floristSessionSummarySchema, json.data);
}

export async function submitFloristRequest(
  sessionId: string,
  body: SubmitCustomOrderRequest,
  idempotencyKey?: string,
) {
  submitCustomOrderRequestSchema.parse(body);
  const json = await fetchJson<{ data: unknown }>(
    `/florist/sessions/${sessionId}/submit`,
    {
      method: "POST",
      body: JSON.stringify(body),
      headers: idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {},
      cache: "no-store",
    },
  );
  return wrap(customOrderRequestResponseSchema, json.data);
}
