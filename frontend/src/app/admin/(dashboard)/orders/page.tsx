"use client";

import { List, useTable } from "@refinedev/antd";
import { useNavigation, useUpdate } from "@refinedev/core";
import { Select } from "antd";
import { ResponsiveTable } from "@/admin/components/ResponsiveTable";
import { OrderStatusTag, ORDER_STATUS } from "@/admin/components/StatusTags";
import { formatDateTime, formatVnd } from "@/admin/format";

const STATUS_OPTIONS = Object.entries(ORDER_STATUS).map(([value, { label }]) => ({
  value,
  label,
}));

type OrderRow = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  itemCount: number;
  totalVnd: string;
  channel: string;
  createdAt: string;
  status: string;
};

export default function AdminOrdersPage() {
  const { show } = useNavigation();
  const { tableProps } = useTable({
    resource: "orders",
    syncWithLocation: true,
    pagination: { pageSize: 20 },
  });
  const { mutate: updateOrder, mutation: updateMutation } = useUpdate();

  return (
    <List title="Đơn hàng">
      <ResponsiveTable<OrderRow>
        tableProps={tableProps}
        rowKey="id"
        onRowClick={(record) => show("orders", record.id)}
        mobileActions={(record) => (
          <Select
            className="w-full"
            size="large"
            value={record.status}
            options={STATUS_OPTIONS}
            loading={updateMutation.isPending}
            onChange={(status) =>
              updateOrder({
                resource: "orders",
                id: record.id,
                values: { status },
              })
            }
          />
        )}
        columns={[
          {
            key: "orderNumber",
            title: "Mã đơn",
            dataIndex: "orderNumber",
            primary: true,
            width: 140,
          },
          {
            key: "customer",
            title: "Khách",
            secondary: true,
            render: (_, r) => `${r.customerName} · ${r.customerPhone}`,
          },
          { key: "itemCount", title: "Dòng", dataIndex: "itemCount", width: 70 },
          {
            key: "totalVnd",
            title: "Tổng",
            dataIndex: "totalVnd",
            width: 130,
            render: (v) => formatVnd(v as string),
          },
          {
            key: "channel",
            title: "Kênh",
            dataIndex: "channel",
            width: 100,
            render: (v) => (
              <span className="text-xs uppercase text-ink/60">{v as string}</span>
            ),
          },
          {
            key: "createdAt",
            title: "Tạo lúc",
            dataIndex: "createdAt",
            width: 160,
            render: (v) => formatDateTime(v as string),
          },
          {
            key: "status",
            title: "Trạng thái",
            width: 240,
            mobileHidden: true,
            render: (_, record) => (
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <Select
                  size="small"
                  className="min-w-[10rem] flex-1"
                  value={record.status}
                  options={STATUS_OPTIONS}
                  loading={updateMutation.isPending}
                  onChange={(status) =>
                    updateOrder({
                      resource: "orders",
                      id: record.id,
                      values: { status },
                    })
                  }
                />
                <OrderStatusTag status={record.status} />
              </div>
            ),
          },
        ]}
      />
    </List>
  );
}
