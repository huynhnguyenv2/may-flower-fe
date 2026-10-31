"use client";

import { List, useTable } from "@refinedev/antd";
import { useNavigation } from "@refinedev/core";
import { ResponsiveTable } from "@/admin/components/ResponsiveTable";

type CustomerRow = {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  orderCount: number;
  customRequestCount: number;
};

export default function AdminCustomersPage() {
  const { show } = useNavigation();
  const { tableProps } = useTable({ resource: "customers" });

  return (
    <List title="Khách hàng">
      <ResponsiveTable<CustomerRow>
        tableProps={tableProps}
        rowKey="id"
        onRowClick={(record) => show("customers", record.id)}
        columns={[
          { key: "name", title: "Tên", dataIndex: "name", primary: true },
          { key: "phone", title: "SĐT", dataIndex: "phone", width: 130, secondary: true },
          { key: "email", title: "Email", dataIndex: "email" },
          { key: "orderCount", title: "Đơn", dataIndex: "orderCount", width: 80 },
          { key: "customRequestCount", title: "YC AI", dataIndex: "customRequestCount", width: 80 },
        ]}
      />
    </List>
  );
}
