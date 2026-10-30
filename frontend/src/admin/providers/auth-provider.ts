"use client";

import type { AuthProvider } from "@refinedev/core";
import {
  ADMIN_ACCESS_TOKEN_KEY,
  ADMIN_REFRESH_TOKEN_KEY,
  adminApiBase,
} from "../constants";
import { adminFetch } from "../admin-fetch";

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    const res = await fetch(`${adminApiBase()}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const json = (await res.json()) as {
      data?: { accessToken: string; refreshToken: string };
      error?: { message?: string };
    };
    if (!res.ok || !json.data) {
      return {
        success: false,
        error: { message: json.error?.message ?? "Đăng nhập thất bại", name: "LoginError" },
      };
    }
    localStorage.setItem(ADMIN_ACCESS_TOKEN_KEY, json.data.accessToken);
    localStorage.setItem(ADMIN_REFRESH_TOKEN_KEY, json.data.refreshToken);
    return { success: true, redirectTo: "/admin/orders" };
  },
  logout: async () => {
    localStorage.removeItem(ADMIN_ACCESS_TOKEN_KEY);
    localStorage.removeItem(ADMIN_REFRESH_TOKEN_KEY);
    return { success: true, redirectTo: "/admin/login" };
  },
  check: async () => {
    const token = localStorage.getItem(ADMIN_ACCESS_TOKEN_KEY);
    if (!token) {
      return { authenticated: false, redirectTo: "/admin/login" };
    }
    try {
      await adminFetch<{ id: string }>("/me");
      return { authenticated: true };
    } catch {
      localStorage.removeItem(ADMIN_ACCESS_TOKEN_KEY);
      return { authenticated: false, redirectTo: "/admin/login" };
    }
  },
  getPermissions: async () => {
    try {
      const me = await adminFetch<{ roles: string[] }>("/me");
      return me.roles;
    } catch {
      return null;
    }
  },
  getIdentity: async () => {
    const me = await adminFetch<{ id: string; email: string; name: string; roles: string[] }>(
      "/me",
    );
    return { id: me.id, name: me.name, email: me.email, roles: me.roles };
  },
  onError: async (error) => {
    if (error?.statusCode === 401 || error?.status === 401) {
      return { logout: true, redirectTo: "/admin/login" };
    }
    return { error };
  },
};
