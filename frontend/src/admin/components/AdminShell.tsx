"use client";

import type { ReactNode } from "react";
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
} from "@ant-design/icons";
import { useLogout, useMenu } from "@refinedev/core";
import { Layout, Menu, Typography, Button, theme } from "antd";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND } from "@/lib/brand";

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

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { menuItems } = useMenu();
  const { mutate: logout } = useLogout();
  const { token } = theme.useToken();

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
          <Link href={item!.route ?? "#"}>{item!.label ?? item!.name}</Link>
        ),
      })),
  }));

  const selectedKey =
    menuItems
      .filter((m) => m.route)
      .sort((a, b) => (b.route!.length ?? 0) - (a.route!.length ?? 0))
      .find((m) => pathname === m.route || pathname.startsWith(`${m.route}/`))?.key ??
    menuItems
      .filter((m) => m.route)
      .sort((a, b) => (b.route!.length ?? 0) - (a.route!.length ?? 0))
      .find((m) => pathname === m.route || pathname.startsWith(`${m.route}/`))?.name ??
    "dashboard";

  return (
    <Layout className="min-h-screen">
      <Sider
        width={248}
        breakpoint="lg"
        collapsedWidth={0}
        theme="dark"
        className="!fixed left-0 top-0 z-20 h-screen overflow-auto"
      >
        <div className="flex items-center gap-3 px-5 py-5">
          <Image src={BRAND.logoSrc} alt="" width={36} height={36} className="rounded-full" />
          <div>
            <Typography.Text className="!text-white !font-display !text-base block leading-tight">
              {BRAND.legalName}
            </Typography.Text>
            <Typography.Text className="!text-white/60 !text-xs">Quản trị studio</Typography.Text>
          </div>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[String(selectedKey)]}
          items={menuItemsGrouped}
          className="border-none"
        />
      </Sider>
      <Layout className="lg:ml-[248px]">
        <Header
          className="sticky top-0 z-10 flex items-center justify-between border-b border-black/5 px-4 lg:px-8"
          style={{ background: token.colorBgContainer, height: 64 }}
        >
          <Typography.Title level={5} className="!mb-0 !font-normal !text-ink/80">
            Bảng điều khiển
          </Typography.Title>
          <Button type="text" icon={<LogoutOutlined />} onClick={() => logout()}>
            Đăng xuất
          </Button>
        </Header>
        <Content className="p-4 lg:p-8">{children}</Content>
      </Layout>
    </Layout>
  );
}
