"use client";

import { List, useTable } from "@refinedev/antd";
import { useNavigation } from "@refinedev/core";
import { Space, Table, Tag } from "antd";

export default function AdminSupportSessionsPage() {
  const { show } = useNavigation();
  const { tableProps } = useTable({
    resource: "support-sessions",
  });

  return (
    <List title="Chat khách (AI support)">
      <Table
        {...tableProps}
        rowKey="id"
        size="middle"
        onRow={(record) => ({
          onClick: () => show("support-sessions", record.id as string),
          style: { cursor: "pointer" },
        })}
      >
        <Table.Column dataIndex="id" title="Session" width={220} ellipsis />
        <Table.Column
          dataIndex="locale"
          title="Ngôn ngữ"
          width={90}
          render={(v: string) => <Tag>{v.toUpperCase()}</Tag>}
        />
        <Table.Column dataIndex="messageCount" title="Tin nhắn" width={90} />
        <Table.Column
          title="Tin cuối"
          render={(_: unknown, row: { lastMessage?: { role: string; content: string } | null }) =>
            row.lastMessage ? (
              <span className="text-ink/80">
                <Tag>{row.lastMessage.role}</Tag> {row.lastMessage.content}
              </span>
            ) : (
              "—"
            )
          }
        />
        <Table.Column
          dataIndex="createdAt"
          title="Bắt đầu"
          width={170}
          render={(v: string) => new Date(v).toLocaleString("vi-VN")}
        />
        <Table.Column
          title=""
          width={100}
          render={(_: unknown, record: { id: string }) => (
            <Space>
              <a
                onClick={(e) => {
                  e.stopPropagation();
                  show("support-sessions", record.id);
                }}
              >
                Xem
              </a>
            </Space>
          )}
        />
      </Table>
    </List>
  );
}
