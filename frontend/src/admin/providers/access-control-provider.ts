"use client";

import type { AccessControlProvider } from "@refinedev/core";
import { adminFetch } from "../admin-fetch";

async function staffRoles(): Promise<string[]> {
  try {
    const me = await adminFetch<{ roles: string[] }>("/me");
    return me.roles;
  } catch {
    return [];
  }
}

export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action }) => {
    const roles = await staffRoles();
    const isOwnerOrManager = roles.some((r) => r === "owner" || r === "manager");
    const canOrders = roles.some((r) =>
      ["owner", "manager", "florist", "delivery"].includes(r),
    );

    if (resource === "products") {
      return { can: isOwnerOrManager && (action === "list" || action === "show") };
    }
    if (resource === "support-sessions") {
      return { can: isOwnerOrManager && (action === "list" || action === "show") };
    }
    if (resource === "assistant") {
      return { can: roles.some((r) => ["owner", "manager", "florist"].includes(r)) };
    }
    if (resource === "orders") {
      if (action === "list" || action === "show") return { can: canOrders };
      if (action === "edit" || action === "update") {
        return { can: roles.some((r) => ["owner", "manager", "florist"].includes(r)) };
      }
    }
    return { can: true };
  },
};
