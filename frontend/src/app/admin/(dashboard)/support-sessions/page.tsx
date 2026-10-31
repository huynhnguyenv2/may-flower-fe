"use client";

import { List, useTable } from "@refinedev/antd";
import { useNavigation } from "@refinedev/core";
import { Tag } from "antd";
import { ResponsiveTable } from "@/admin/components/ResponsiveTable";
import { formatDateTime } from "@/admin/format";

type SessionRow = {
  id: string;
  locale: string;
  messageCount: number;
  lastMessage?: { role: string; content: string } | null;
  createdAt: string;
};

export default function AdminSupportSessionsPage() {
  const { show } = useNavigation();
  const { tableProps } = useTable({
    resource: "support-sessions",
  });

  return (
    <List title="Chat khách (AI support)">
      <ResponsiveTable<SessionRow>
        tableProps={tableProps}
        rowKey="id"
        onRowClick={(record) => show("support-sessions", record.id)}
        columns={[
          {
            key: "id",
            title: "Session",
            dataIndex: "id",
            width: 220,
            primary: true,
            render: (v) => (
              <span className="break-all font-mono text-xs">{v as string}</span>
            ),
          },
          {
            key: "locale",
            title: "Ngôn ngữ",
            dataIndex: "locale",
            width: 90,
            secondary: true,
            render: (v) => <Tag>{(v as string).toUpperCase()}</Tag>,
          },
          { key: "messageCount", title: "Tin nhắn", dataIndex: "messageCount", width: 90 },
          {
            key: "lastMessage",
            title: "Tin cuối",
            render: (_, row) =>
              row.lastMessage ? (
                <span className="line-clamp-2 text-ink/80">
                  <Tag>{row.lastMessage.role}</Tag> {row.lastMessage.content}
                </span>
              ) : (
                "—"
              ),
          },
          {
            key: "createdAt",
            title: "Bắt đầu",
            dataIndex: "createdAt",
            width: 170,
            render: (v) => formatDateTime(v as string),
          },
        ]}
      />
    </List>
  );
}
