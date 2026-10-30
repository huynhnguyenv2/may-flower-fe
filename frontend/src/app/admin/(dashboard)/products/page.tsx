"use client";

import { List, useTable } from "@refinedev/antd";
import { Table, Tag } from "antd";
import { formatVnd } from "@/admin/format";

export default function AdminProductsPage() {
  const { tableProps } = useTable({ resource: "products" });

  return (
    <List title="Sản phẩm (catalog cố định)">
      <Table
        {...tableProps}
        rowKey="id"
        size="middle"
        expandable={{
          expandedRowRender: (record) => {
            const row = record as {
              variants?: {
                sku: string;
                sizeLabel: string;
                priceVnd: string;
                availableQuantity: number;
                active: boolean;
              }[];
            };
            return (
            <Table
              size="small"
              pagination={false}
              rowKey="sku"
              dataSource={row.variants ?? []}
              columns={[
                { title: "SKU", dataIndex: "sku", width: 100 },
                { title: "Size", dataIndex: "sizeLabel", width: 90 },
                {
                  title: "Giá",
                  dataIndex: "priceVnd",
                  render: (v: string) => formatVnd(v),
                },
                { title: "Tồn", dataIndex: "availableQuantity", width: 70 },
                {
                  title: "Active",
                  dataIndex: "active",
                  render: (v: boolean) => (v ? <Tag color="green">Yes</Tag> : <Tag>No</Tag>),
                },
              ]}
            />
            );
          },
        }}
      >
        <Table.Column dataIndex="name" title="Tên" />
        <Table.Column dataIndex="slug" title="Slug" width={160} />
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
