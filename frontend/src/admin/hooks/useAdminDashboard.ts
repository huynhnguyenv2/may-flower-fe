"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "../admin-fetch";

export type DashboardData = {
  kpis: {
    ordersToday: number;
    pendingPayment: number;
    inProduction: number;
    lowStockVariants: number;
    openSupportSessions: number;
    revenueTodayVnd: string;
    pendingAiRequests: number;
    revenue7dVnd: string;
    orders7d: number;
    aiConversionRatePercent: number;
  };
  ordersByStatus: Record<string, number>;
  recentOrders: {
    id: string;
    orderNumber: string;
    status: string;
    customerName: string;
    totalVnd: string;
    createdAt: string;
  }[];
  recentActivity: {
    id: string;
    action: string;
    entityType: string;
    actorName: string | null;
    createdAt: string;
  }[];
  popularProducts: { name: string; quantitySold: number }[];
  popularAddons: { name: string; quantity: number }[];
  lowStock: {
    variantId: string;
    sku: string;
    productName: string;
    sizeLabel: string;
    availableQuantity: number;
  }[];
  alerts: { severity: "warning" | "info"; message: string }[];
};

export function useAdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await adminFetch<DashboardData>("/dashboard");
        if (!cancelled) setData(res);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Lỗi tải dashboard");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}
