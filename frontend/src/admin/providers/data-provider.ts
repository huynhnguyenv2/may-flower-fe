"use client";

import type {
  BaseRecord,
  DataProvider,
  GetListParams,
  GetOneParams,
  UpdateParams,
  CreateParams,
} from "@refinedev/core";
import { adminApiBase } from "../constants";
import { adminFetch } from "../admin-fetch";

function filterValue(filters: GetListParams["filters"], field: string): string | undefined {
  const f = filters?.find((x) => "field" in x && x.field === field);
  return f && "value" in f && f.value != null ? String(f.value) : undefined;
}

export const dataProvider: DataProvider = {
  getApiUrl: () => adminApiBase(),
  getList: async <TData extends BaseRecord = BaseRecord>(params: GetListParams) => {
    const { resource, filters, pagination } = params;
    const pageSize = pagination?.pageSize ?? 20;
    const current =
      (pagination as { current?: number; currentPage?: number } | undefined)?.currentPage ??
      (pagination as { current?: number } | undefined)?.current ??
      1;
    const offset = (current - 1) * pageSize;

    if (resource === "orders") {
      const status = filterValue(filters, "status");
      const q = filterValue(filters, "q");
      const qs = new URLSearchParams();
      if (status) qs.set("status", status);
      if (q) qs.set("q", q);
      qs.set("limit", String(pageSize));
      qs.set("offset", String(offset));
      const data = await adminFetch<{ items: TData[]; total: number }>(`/orders?${qs}`);
      return { data: data.items, total: data.total };
    }
    if (resource === "products") {
      const data = await adminFetch<TData[]>("/products");
      return { data, total: data.length };
    }
    if (resource === "support-sessions") {
      const data = await adminFetch<TData[]>("/support/sessions");
      return { data, total: data.length };
    }
    if (resource === "custom-order-requests") {
      const status = filterValue(filters, "status");
      const qs = status ? `?status=${encodeURIComponent(status)}` : "";
      const data = await adminFetch<TData[]>(`/custom-order-requests${qs}`);
      return { data, total: data.length };
    }
    if (resource === "customers") {
      const q = filterValue(filters, "q");
      const qs = q ? `?q=${encodeURIComponent(q)}` : "";
      const data = await adminFetch<TData[]>(`/customers${qs}`);
      return { data, total: data.length };
    }
    if (resource === "flowers") {
      const data = await adminFetch<TData[]>("/flowers");
      return { data, total: data.length };
    }
    if (resource === "addons") {
      const data = await adminFetch<TData[]>("/addons");
      return { data, total: data.length };
    }
    if (resource === "inventory") {
      const data = await adminFetch<TData[]>("/inventory/low-stock");
      return { data, total: data.length };
    }
    throw new Error(`Unknown resource: ${resource}`);
  },
  getOne: async <TData extends BaseRecord = BaseRecord>(params: GetOneParams) => {
    const { resource, id } = params;
    if (resource === "orders") {
      const data = await adminFetch<TData>(`/orders/${id}`);
      return { data };
    }
    if (resource === "support-sessions") {
      const data = await adminFetch<TData>(`/support/sessions/${id}`);
      return { data };
    }
    if (resource === "custom-order-requests") {
      const data = await adminFetch<TData>(`/custom-order-requests/${id}`);
      return { data };
    }
    if (resource === "customers") {
      const data = await adminFetch<TData>(`/customers/${id}`);
      return { data };
    }
    if (resource === "flowers") {
      const data = await adminFetch<TData>(`/flowers/${id}`);
      return { data };
    }
    if (resource === "addons") {
      const data = await adminFetch<TData>(`/addons/${id}`);
      return { data };
    }
    throw new Error("getOne not implemented");
  },
  create: async <TData extends BaseRecord = BaseRecord, TVariables = Record<string, unknown>>(
    params: CreateParams<TVariables>,
  ) => {
    const { resource, variables } = params;
    if (resource === "flowers") {
      const vars = variables as Record<string, unknown>;
      const payload = {
        ...vars,
        colorTags:
          typeof vars.colorTags === "string"
            ? String(vars.colorTags)
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            : vars.colorTags,
      };
      const data = await adminFetch<TData>("/flowers", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      return { data };
    }
    if (resource === "addons") {
      const data = await adminFetch<TData>("/addons", {
        method: "POST",
        body: JSON.stringify(variables),
      });
      return { data };
    }
    throw new Error("create not implemented");
  },
  update: async <TData extends BaseRecord = BaseRecord, TVariables = Record<string, unknown>>(
    params: UpdateParams<TVariables>,
  ) => {
    const { resource, id, variables } = params;
    const vars = variables as { status?: string } | undefined;
    if (resource === "orders" && vars?.status) {
      const data = await adminFetch(`/orders/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: vars.status }),
      });
      return { data: data as TData };
    }
    if (resource === "custom-order-requests" && vars?.status) {
      const data = await adminFetch(`/custom-order-requests/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: vars.status }),
      });
      return { data: data as TData };
    }
    if (resource === "flowers") {
      const data = await adminFetch(`/flowers/${id}`, {
        method: "PATCH",
        body: JSON.stringify(variables),
      });
      return { data: data as TData };
    }
    if (resource === "addons") {
      const data = await adminFetch(`/addons/${id}`, {
        method: "PATCH",
        body: JSON.stringify(variables),
      });
      return { data: data as TData };
    }
    throw new Error("update not implemented");
  },
  deleteOne: async () => {
    throw new Error("deleteOne not implemented");
  },
  getMany: async () => ({ data: [] }),
  createMany: async () => ({ data: [] }),
  updateMany: async () => ({ data: [] }),
  deleteMany: async () => ({ data: [] }),
};
