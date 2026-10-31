"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import {
  DashboardOutlined,
  ShoppingOutlined,
  RobotOutlined,
  AppstoreOutlined,
  UserOutlined,
  InboxOutlined,
  GiftOutlined,
  MessageOutlined,
  LogoutOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { useLogout, useMenu } from "@refinedev/core";
import { Button, Drawer, Layout, Menu, Typography, theme } from "antd";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND } from "@/lib/brand";
import { useAdminBreakpoint } from "@/admin/hooks/useAdminBreakpoint";

const { Header, Sider, Content } = Layout;

const ICONS: Record<string, ReactNode> = {
  dashboard: <DashboardOutlined />,
  orders: <ShoppingOutlined />,
  "custom-order-requests": <RobotOutlined />,
  products: <AppstoreOutlined />,
  flowers: <GiftOutlined />,
  addons: <GiftOutlined />,
  customers: <UserOutlined />,
  inventory: <InboxOutlined />,
  "support-sessions": <MessageOutlined />,
  assistant: <RobotOutlined />,
};

const NAV_GROUPS: { label: string; keys: string[] }[] = [
  { label: "Vận hành", keys: ["dashboard", "orders", "custom-order-requests", "inventory"] },
  { label: "Catalog", keys: ["products", "flowers", "addons"] },
  { label: "Khách hàng", keys: ["customers", "support-sessions"] },
  { label: "Hệ thống", keys: ["assistant"] },
];

const QUICK_LINKS = [
  { href: "/admin/custom-order-requests", label: "YC AI chờ duyệt", icon: <RobotOutlined /> },
  { href: "/admin/orders", label: "Đơn hàng", icon: <ShoppingOutlined /> },
  { href: "/admin/inventory", label: "Tồn kho", icon: <InboxOutlined /> },
];

function useCurrentMenuItem() {
  const pathname = usePathname();
  const { menuItems } = useMenu();
  return useMemo(
    () =>
      menuItems
        .filter((m) => m.route)
        .sort((a, b) => (b.route!.length ?? 0) - (a.route!.length ?? 0))
        .find((m) => pathname === m.route || pathname.startsWith(`${m.route}/`)),
    [menuItems, pathname],
  );
}

function useSelectedMenuKey() {
  const current = useCurrentMenuItem();
  return String(current?.key ?? current?.name ?? "dashboard");
}

function AdminNavMenu({
  selectedKey,
  onNavigate,
}: {
  selectedKey: string;
  onNavigate?: () => void;
}) {
  const { menuItems } = useMenu();
  const itemsByName = Object.fromEntries(menuItems.map((m) => [m.name, m]));

  const menuItemsGrouped = NAV_GROUPS.map((group) => ({
    type: "group" as const,
    label: group.label,
    children: group.keys
      .map((key) => itemsByName[key])
      .filter(Boolean)
      .map((item) => ({
        key: item!.key ?? item!.name,
        icon: ICONS[item!.name] ?? <AppstoreOutlined />,
        label: (
          <Link href={item!.route ?? "#"} onClick={onNavigate}>
            {item!.label ?? item!.name}
          </Link>
        ),
      })),
  }));

  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[selectedKey]}
      items={menuItemsGrouped}
      className="border-none"
    />
  );
}

function BrandBlock({ compact }: { compact?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${compact ? "px-4 py-4" : "px-5 py-5"}`}>
      <Image src={BRAND.logoSrc} alt="" width={36} height={36} className="rounded-full" />
      <div>
        <Typography.Text className="!text-white !font-display !text-base block leading-tight">
          {BRAND.legalName}
        </Typography.Text>
        <Typography.Text className="!text-white/60 !text-xs">Quản trị studio</Typography.Text>
      </div>
    </div>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { mutate: logout } = useLogout();
  const { token } = theme.useToken();
  const { isMobile } = useAdminBreakpoint();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const selectedKey = useSelectedMenuKey();
  const currentItem = useCurrentMenuItem();

  const pageTitle = currentItem?.label ?? "Quản trị";

  const closeDrawer = () => setDrawerOpen(false);

  return (
    <Layout className="admin-app min-h-screen">
      {!isMobile ? (
        <Sider
          width={248}
          theme="dark"
          className="!fixed left-0 top-0 z-20 h-screen overflow-auto"
        >
          <BrandBlock />
          <AdminNavMenu selectedKey={selectedKey} />
        </Sider>
      ) : (
        <Drawer
          placement="left"
          open={drawerOpen}
          onClose={closeDrawer}
          width="min(100vw - 48px, 300px)"
          styles={{
            body: { padding: 0, background: "#1A1A1A" },
            header: { display: "none" },
          }}
          className="admin-drawer-nav"
        >
          <BrandBlock compact />
          <AdminNavMenu selectedKey={selectedKey} onNavigate={closeDrawer} />
          <div className="border-t border-white/10 px-4 py-4">
            <Typography.Text className="!text-white/50 !text-xs uppercase tracking-wide">
              Truy cập nhanh
            </Typography.Text>
            <div className="mt-2 flex flex-col gap-1">
              {QUICK_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeDrawer}
                  className="flex min-h-[44px] items-center gap-2 rounded-lg px-2 text-sm text-white/90 hover:bg-white/10"
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </Drawer>
      )}

      <Layout className={isMobile ? "" : "lg:ml-[248px]"}>
        <Header
          className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-black/5 px-4 lg:px-8"
          style={{ background: token.colorBgContainer, height: isMobile ? 56 : 64 }}
        >
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {isMobile ? (
              <Button
                type="text"
                aria-label="Mở menu"
                icon={<MenuOutlined />}
                className="!min-h-[44px] !min-w-[44px]"
                onClick={() => setDrawerOpen(true)}
              />
            ) : null}
            <Typography.Title
              level={5}
              className="!mb-0 !truncate !font-normal !text-ink/80"
              title={pageTitle}
            >
              {pageTitle}
            </Typography.Title>
          </div>
          <Button
            type="text"
            icon={<LogoutOutlined />}
            className="!min-h-[44px] shrink-0"
            onClick={() => logout()}
          >
            {isMobile ? null : "Đăng xuất"}
          </Button>
        </Header>
        <Content className="admin-content p-4 lg:p-8">{children}</Content>
      </Layout>
    </Layout>
  );
}
