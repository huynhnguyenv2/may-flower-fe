"use client";

import { List, useTable } from "@refinedev/antd";
import { useNavigation, useUpdate } from "@refinedev/core";
import { Select, Table } from "antd";
import { OrderStatusTag, ORDER_STATUS } from "@/admin/components/StatusTags";
import { formatDateTime, formatVnd } from "@/admin/format";

const STATUS_OPTIONS = Object.entries(ORDER_STATUS).map(([value, { label }]) => ({
  value,
  label,
}));

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
      <Table
        {...tableProps}
        rowKey="id"
        size="middle"
        onRow={(record) => ({
          onClick: () => show("orders", record.id as string),
          style: { cursor: "pointer" },
        })}
      >
        <Table.Column dataIndex="orderNumber" title="Mã đơn" width={140} />
        <Table.Column dataIndex="customerName" title="Khách" />
        <Table.Column dataIndex="customerPhone" title="SĐT" width={120} />
        <Table.Column dataIndex="itemCount" title="Dòng" width={70} />
        <Table.Column
          dataIndex="totalVnd"
          title="Tổng"
          width={130}
          render={(v: string) => formatVnd(v)}
        />
        <Table.Column
          dataIndex="channel"
          title="Kênh"
          width={100}
          render={(v: string) => <span className="text-xs uppercase text-ink/60">{v}</span>}
        />
        <Table.Column
          dataIndex="createdAt"
          title="Tạo lúc"
          width={160}
          render={(v: string) => formatDateTime(v)}
        />
        <Table.Column
          title="Trạng thái"
          width={240}
          render={(_, record: { id: string; status: string }) => (
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
          )}
        />
      </Table>
    </List>
  );
}
