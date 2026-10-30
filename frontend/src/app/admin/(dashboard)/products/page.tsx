"use client";

import { List, useTable } from "@refinedev/antd";
import { Table, Tag } from "antd";

export default function AdminProductsPage() {
  const { tableProps } = useTable({
    resource: "products",
  });

  return (
    <List title="Sản phẩm">
      <Table {...tableProps} rowKey="id" size="middle">
        <Table.Column dataIndex="slug" title="Slug" width={160} />
        <Table.Column dataIndex="name" title="Tên" />
        <Table.Column
          dataIndex="active"
          title="Active"
          width={90}
          render={(v: boolean) => (v ? <Tag color="green">Yes</Tag> : <Tag>No</Tag>)}
        />
        <Table.Column
          dataIndex="featured"
          title="Featured"
          width={100}
          render={(v: boolean) => (v ? <Tag color="gold">Yes</Tag> : <Tag>No</Tag>)}
        />
        <Table.Column
          title="Variants"
          render={(_: unknown, record: { variants?: unknown[] }) => record.variants?.length ?? 0}
          width={90}
        />
      </Table>
    </List>
  );
}
