"use client";

import { Show } from "@refinedev/antd";
import { useNavigation, useShow } from "@refinedev/core";
import { Card, List, Typography } from "antd";
import { CustomRequestStatusTag, OrderStatusTag } from "@/admin/components/StatusTags";
import { formatDateTime, formatVnd } from "@/admin/format";

export default function AdminCustomerShowPage() {
  const { query } = useShow({ resource: "customers" });
  const { show } = useNavigation();
  const record = query.data?.data as
    | {
        name: string;
        phone: string;
        email?: string | null;
        orders: {
          id: string;
          orderNumber: string;
          status: string;
          totalVnd: string;
          createdAt: string;
        }[];
        customOrderRequests: {
          id: string;
          requestNumber: string;
          status: string;
          createdAt: string;
        }[];
      }
    | undefined;

  return (
    <Show title={record?.name ?? "Khách hàng"} isLoading={query.isLoading}>
      {record ? (
        <div className="space-y-4">
          <Card size="small">
            <Typography.Paragraph className="!mb-1">{record.phone}</Typography.Paragraph>
            {record.email ? <Typography.Paragraph>{record.email}</Typography.Paragraph> : null}
          </Card>
          <Card title="Lịch sử đơn">
            <List
              dataSource={record.orders}
              locale={{ emptyText: "Chưa có đơn" }}
              renderItem={(o) => (
                <List.Item
                  actions={[
                    <a key="v" onClick={() => show("orders", o.id)}>
                      Xem
                    </a>,
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <span className="flex items-center gap-2">
                        {o.orderNumber}
                        <OrderStatusTag status={o.status} />
                      </span>
                    }
                    description={`${formatDateTime(o.createdAt)} · ${formatVnd(o.totalVnd)}`}
                  />
                </List.Item>
              )}
            />
          </Card>
          <Card title="Yêu cầu AI Florist">
            <List
              dataSource={record.customOrderRequests}
              locale={{ emptyText: "Chưa có yêu cầu" }}
              renderItem={(r) => (
                <List.Item
                  actions={[
                    <a key="v" onClick={() => show("custom-order-requests", r.id)}>
                      Xem
                    </a>,
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <span className="flex items-center gap-2">
                        {r.requestNumber}
                        <CustomRequestStatusTag status={r.status} />
                      </span>
                    }
                    description={formatDateTime(r.createdAt)}
                  />
                </List.Item>
              )}
            />
          </Card>
        </div>
      ) : null}
    </Show>
  );
}
