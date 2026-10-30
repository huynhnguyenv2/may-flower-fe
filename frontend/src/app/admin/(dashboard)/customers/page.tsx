"use client";

import { List, useTable } from "@refinedev/antd";
import { useNavigation } from "@refinedev/core";
import { Table } from "antd";

export default function AdminCustomersPage() {
  const { show } = useNavigation();
  const { tableProps } = useTable({ resource: "customers" });

  return (
    <List title="Khách hàng">
      <Table
        {...tableProps}
        rowKey="id"
        onRow={(record) => ({
          onClick: () => show("customers", record.id as string),
          style: { cursor: "pointer" },
        })}
      >
        <Table.Column dataIndex="name" title="Tên" />
        <Table.Column dataIndex="phone" title="SĐT" width={130} />
        <Table.Column dataIndex="email" title="Email" />
        <Table.Column dataIndex="orderCount" title="Đơn" width={80} />
        <Table.Column dataIndex="customRequestCount" title="YC AI" width={80} />
      </Table>
    </List>
  );
}
