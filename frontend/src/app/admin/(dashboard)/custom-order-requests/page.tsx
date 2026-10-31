"use client";

import { List, useTable } from "@refinedev/antd";
import { useNavigation } from "@refinedev/core";
import { ResponsiveTable } from "@/admin/components/ResponsiveTable";
import { CustomRequestStatusTag } from "@/admin/components/StatusTags";
import { formatDateTime, formatVnd } from "@/admin/format";

type RequestRow = {
  id: string;
  requestNumber: string;
  status: string;
  customerName: string;
  customerPhone: string;
  totalVnd: string;
  createdAt: string;
};

export default function AdminCustomOrderRequestsPage() {
  const { show } = useNavigation();
  const { tableProps } = useTable({
    resource: "custom-order-requests",
  });

  return (
    <List title="Yêu cầu AI Florist">
      <ResponsiveTable<RequestRow>
        tableProps={tableProps}
        rowKey="id"
        onRowClick={(record) => show("custom-order-requests", record.id)}
        columns={[
          {
            key: "requestNumber",
            title: "Mã YC",
            dataIndex: "requestNumber",
            primary: true,
            width: 140,
          },
          {
            key: "status",
            title: "Trạng thái",
            dataIndex: "status",
            width: 140,
            secondary: true,
            render: (v) => <CustomRequestStatusTag status={v as string} />,
          },
          { key: "customerName", title: "Khách", dataIndex: "customerName" },
          { key: "customerPhone", title: "SĐT", dataIndex: "customerPhone", width: 120 },
          {
            key: "totalVnd",
            title: "Tổng ước tính",
            dataIndex: "totalVnd",
            width: 130,
            render: (v) => formatVnd(v as string),
          },
          {
            key: "createdAt",
            title: "Ngày gửi",
            dataIndex: "createdAt",
            width: 170,
            render: (v) => formatDateTime(v as string),
          },
        ]}
      />
    </List>
  );
}
