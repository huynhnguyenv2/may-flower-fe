"use client";

import { List, useTable } from "@refinedev/antd";
import { useUpdate } from "@refinedev/core";
import { Select, Table, Tag } from "antd";

const STATUS_LABELS: Record<string, string> = {
  pending_payment: "Chờ thanh toán",
  confirmed: "Đã xác nhận",
  in_production: "Đang làm hoa",
  out_for_delivery: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
};

const STATUS_OPTIONS = Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }));

export default function AdminOrdersPage() {
  const { tableProps } = useTable({
    resource: "orders",
    syncWithLocation: true,
  });
  const { mutate: updateOrder, mutation: updateMutation } = useUpdate();

  return (
    <List title="Đơn hàng">
      <Table {...tableProps} rowKey="id" size="middle">
        <Table.Column dataIndex="orderNumber" title="Mã đơn" width={140} />
        <Table.Column dataIndex="customerName" title="Khách" />
        <Table.Column dataIndex="customerPhone" title="SĐT" width={120} />
        <Table.Column dataIndex="itemCount" title="Số dòng" width={80} />
        <Table.Column dataIndex="totalVnd" title="Tổng (VND)" width={120} />
        <Table.Column
          dataIndex="channel"
          title="Kênh"
          width={90}
          render={(v: string) => <Tag>{v}</Tag>}
        />
        <Table.Column
          dataIndex="createdAt"
          title="Tạo lúc"
          width={180}
          render={(v: string) => new Date(v).toLocaleString("vi-VN")}
        />
        <Table.Column
          title="Trạng thái"
          width={200}
          render={(_, record: { id: string; status: string }) => (
            <Select
              size="small"
              className="min-w-[11rem]"
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
        />
      </Table>
    </List>
  );
}
