"use client";

import type {
  BaseRecord,
  DataProvider,
  GetListParams,
  GetOneParams,
  UpdateParams,
} from "@refinedev/core";
import { adminApiBase } from "../constants";
import { adminFetch } from "../admin-fetch";

export const dataProvider: DataProvider = {
  getApiUrl: () => adminApiBase(),
  getList: async <TData extends BaseRecord = BaseRecord>(params: GetListParams) => {
    const { resource, filters } = params;
    if (resource === "orders") {
      const statusFilter = filters?.find((f) => "field" in f && f.field === "status");
      const status =
        statusFilter && "value" in statusFilter ? String(statusFilter.value) : undefined;
      const qs = status ? `?status=${encodeURIComponent(status)}` : "";
      const data = await adminFetch<TData[]>(`/orders${qs}`);
      return { data, total: data.length };
    }
    if (resource === "products") {
      const data = await adminFetch<TData[]>("/products");
      return { data, total: data.length };
    }
    if (resource === "support-sessions") {
      const data = await adminFetch<TData[]>("/support/sessions");
      return { data, total: data.length };
    }
    throw new Error(`Unknown resource: ${resource}`);
  },
  getOne: async <TData extends BaseRecord = BaseRecord>(params: GetOneParams) => {
    const { resource, id } = params;
    if (resource === "support-sessions") {
      const data = await adminFetch<TData>(`/support/sessions/${id}`);
      return { data };
    }
    throw new Error("getOne not implemented");
  },
  create: async () => {
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
