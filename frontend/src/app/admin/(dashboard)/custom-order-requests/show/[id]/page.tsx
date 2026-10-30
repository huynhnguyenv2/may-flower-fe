"use client";

import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Card, List, Tag, Typography } from "antd";

export default function AdminCustomOrderRequestShowPage() {
  const { query } = useShow({
    resource: "custom-order-requests",
  });
  const record = query.data?.data as
    | {
        requestNumber: string;
        status: string;
        customer: { name: string; phone: string };
        pricing: { totalVnd: string; lines?: { label: string; amountVnd: string }[] };
        configuration: unknown;
        conversationSummary?: string;
        referenceImageUrl?: string | null;
        messages?: { role: string; content: string; createdAt: string }[];
      }
    | undefined;

  return (
    <Show title="Chi tiết yêu cầu AI Florist" isLoading={query.isLoading}>
      {record ? (
        <div className="space-y-4">
          <Typography.Title level={4}>{record.requestNumber}</Typography.Title>
          <Tag>{record.status}</Tag>
          <Typography.Paragraph>
            Khách: {record.customer.name} · {record.customer.phone}
          </Typography.Paragraph>
          {record.referenceImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={record.referenceImageUrl}
              alt=""
              className="max-h-64 rounded-lg object-cover"
            />
          ) : null}
          <Card title="Giá ước tính (snapshot)" size="small">
            <Typography.Text strong>{record.pricing.totalVnd} VND</Typography.Text>
            <ul className="mt-2 text-sm">
              {record.pricing.lines?.map((l) => (
                <li key={l.label}>
                  {l.label}: {l.amountVnd}
                </li>
              ))}
            </ul>
          </Card>
          <Card title="Cấu hình" size="small">
            <pre className="overflow-auto text-xs">{JSON.stringify(record.configuration, null, 2)}</pre>
          </Card>
          {record.messages?.length ? (
            <List
              header="Hội thoại"
              dataSource={record.messages}
              renderItem={(m) => (
                <List.Item>
                  <Card size="small" className="w-full" title={m.role}>
                    <Typography.Paragraph className="mb-0 whitespace-pre-wrap">
                      {m.content}
                    </Typography.Paragraph>
                  </Card>
                </List.Item>
              )}
            />
          ) : null}
        </div>
      ) : null}
    </Show>
  );
}
