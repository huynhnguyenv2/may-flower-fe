"use client";

import { Authenticated } from "@refinedev/core";
import { NavigateToResource } from "@refinedev/nextjs-router/app";
import { ConfigProvider } from "antd";
import { AdminShell } from "@/admin/components/AdminShell";
import { adminTheme } from "@/admin/theme";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider theme={adminTheme}>
      <Authenticated
        key="admin-dashboard"
        fallback={<NavigateToResource fallbackTo="/admin/login" />}
      >
        <AdminShell>{children}</AdminShell>
      </Authenticated>
    </ConfigProvider>
  );
}
