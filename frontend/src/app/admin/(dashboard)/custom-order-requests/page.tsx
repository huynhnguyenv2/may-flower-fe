"use client";

import { List, useTable } from "@refinedev/antd";
import { useNavigation } from "@refinedev/core";
import { Space, Table } from "antd";
import { CustomRequestStatusTag } from "@/admin/components/StatusTags";
import { formatVnd } from "@/admin/format";

export default function AdminCustomOrderRequestsPage() {
  const { show } = useNavigation();
  const { tableProps } = useTable({
    resource: "custom-order-requests",
  });

  return (
    <List title="Yêu cầu AI Florist">
      <Table
        {...tableProps}
        rowKey="id"
        size="middle"
        onRow={(record) => ({
          onClick: () => show("custom-order-requests", record.id as string),
          style: { cursor: "pointer" },
        })}
      >
        <Table.Column dataIndex="requestNumber" title="Mã YC" width={140} />
        <Table.Column
          dataIndex="status"
          title="Trạng thái"
          width={140}
          render={(v: string) => <CustomRequestStatusTag status={v} />}
        />
        <Table.Column dataIndex="customerName" title="Khách" />
        <Table.Column dataIndex="customerPhone" title="SĐT" width={120} />
        <Table.Column
          dataIndex="totalVnd"
          title="Tổng ước tính"
          width={130}
          render={(v: string) => formatVnd(v)}
        />
        <Table.Column
          dataIndex="createdAt"
          title="Ngày gửi"
          width={170}
          render={(v: string) => new Date(v).toLocaleString("vi-VN")}
        />
        <Table.Column
          title=""
          width={80}
          render={(_: unknown, record: { id: string }) => (
            <Space>
              <a
                onClick={(e) => {
                  e.stopPropagation();
                  show("custom-order-requests", record.id);
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
