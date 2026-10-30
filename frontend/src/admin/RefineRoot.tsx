"use client";

import { Refine } from "@refinedev/core";
import { useNotificationProvider } from "@refinedev/antd";
import routerProvider from "@refinedev/nextjs-router/app";
import { authProvider } from "./providers/auth-provider";
import { dataProvider } from "./providers/data-provider";
import { accessControlProvider } from "./providers/access-control-provider";

export function RefineRoot({ children }: { children: React.ReactNode }) {
  return (
    <Refine
      routerProvider={routerProvider}
      authProvider={authProvider}
      dataProvider={dataProvider}
      accessControlProvider={accessControlProvider}
      notificationProvider={useNotificationProvider}
      resources={[
        {
          name: "orders",
          list: "/admin/orders",
          meta: { label: "Đơn hàng" },
        },
        {
          name: "custom-order-requests",
          list: "/admin/custom-order-requests",
          show: "/admin/custom-order-requests/show/:id",
          meta: { label: "Yêu cầu AI Florist" },
        },
        {
          name: "products",
          list: "/admin/products",
          meta: { label: "Sản phẩm" },
        },
        {
          name: "support-sessions",
          list: "/admin/support-sessions",
          show: "/admin/support-sessions/show/:id",
          meta: { label: "Chat khách (AI)" },
        },
        {
          name: "assistant",
          list: "/admin/assistant",
          meta: { label: "Trợ lý AI" },
        },
      ]}
      options={{
        syncWithLocation: true,
        warnWhenUnsavedChanges: true,
        title: { text: "nau.fleur Admin", icon: null },
      }}
    >
      {children}
    </Refine>
  );
}
