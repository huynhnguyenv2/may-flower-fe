"use client";

import { Authenticated } from "@refinedev/core";
import { ThemedLayout } from "@refinedev/antd";
import { NavigateToResource } from "@refinedev/nextjs-router/app";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Authenticated
      key="admin-dashboard"
      fallback={<NavigateToResource fallbackTo="/admin/login" />}
    >
      <ThemedLayout>{children}</ThemedLayout>
    </Authenticated>
  );
}
