"use client";

import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Card, List, Tag, Typography } from "antd";

type Message = {
  id: string;
  role: string;
  content: string;
  createdAt: string;
};

export default function AdminSupportSessionShowPage() {
  const { query } = useShow({
    resource: "support-sessions",
  });
  const record = query.data?.data as
    | {
        id: string;
        locale: string;
        createdAt: string;
        messages: Message[];
      }
    | undefined;

  return (
    <Show title="Chi tiết chat khách" isLoading={query.isLoading}>
      {record ? (
        <div className="space-y-4">
          <Typography.Paragraph>
            <Tag>{record.locale.toUpperCase()}</Tag>
            <span className="ml-2 text-sm text-neutral-500">
              {new Date(record.createdAt).toLocaleString("vi-VN")} · {record.messages.length} tin
            </span>
          </Typography.Paragraph>
          <List
            dataSource={record.messages}
            renderItem={(m) => (
              <List.Item>
                <Card
                  size="small"
                  className="w-full"
                  title={
                    <span>
                      {m.role === "user" ? "Khách" : "AI / Bot"}{" "}
                      <Typography.Text type="secondary" className="text-xs">
                        {new Date(m.createdAt).toLocaleString("vi-VN")}
                      </Typography.Text>
                    </span>
                  }
                >
                  <Typography.Paragraph className="mb-0 whitespace-pre-wrap">
                    {m.content}
                  </Typography.Paragraph>
                </Card>
              </List.Item>
            )}
          />
        </div>
      ) : null}
    </Show>
  );
}
