"use client";

import { List, useTable } from "@refinedev/antd";
import { Table, Tag } from "antd";
import { ResponsiveTable } from "@/admin/components/ResponsiveTable";
import { formatVnd } from "@/admin/format";

type Variant = {
  sku: string;
  sizeLabel: string;
  priceVnd: string;
  availableQuantity: number;
  active: boolean;
};

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  featured: boolean;
  variants?: Variant[];
};

export default function AdminProductsPage() {
  const { tableProps } = useTable({ resource: "products" });

  const variantTable = (variants: Variant[]) => (
    <Table
      size="small"
      pagination={false}
      rowKey="sku"
      dataSource={variants}
      scroll={{ x: true }}
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

  return (
    <List title="Sản phẩm (catalog cố định)">
      <ResponsiveTable<ProductRow>
        tableProps={{
          ...tableProps,
          expandable: {
            expandedRowRender: (record) => variantTable(record.variants ?? []),
          },
        }}
        rowKey="id"
        mobileExpand={(record) =>
          record.variants?.length ? (
            <div className="rounded-lg bg-black/[0.03] p-2">
              <div className="mb-2 text-xs font-medium text-ink/50">Biến thể</div>
              <ul className="space-y-2 text-sm">
                {record.variants.map((v) => (
                  <li key={v.sku} className="rounded-md bg-white/80 px-2 py-2">
                    <div className="font-medium">
                      {v.sizeLabel} · {formatVnd(v.priceVnd)}
                    </div>
                    <div className="text-xs text-ink/60">
                      SKU {v.sku} · Tồn {v.availableQuantity} ·{" "}
                      {v.active ? "Active" : "Off"}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null
        }
        columns={[
          { key: "name", title: "Tên", dataIndex: "name", primary: true },
          { key: "slug", title: "Slug", dataIndex: "slug", width: 160, secondary: true },
          {
            key: "active",
            title: "Active",
            dataIndex: "active",
            width: 90,
            render: (v) => ((v as boolean) ? <Tag color="green">Yes</Tag> : <Tag>No</Tag>),
          },
          {
            key: "featured",
            title: "Featured",
            dataIndex: "featured",
            width: 100,
            render: (v) => ((v as boolean) ? <Tag color="gold">Yes</Tag> : <Tag>No</Tag>),
          },
          {
            key: "variants",
            title: "Variants",
            render: (_, record) => record.variants?.length ?? 0,
            width: 90,
          },
        ]}
      />
    </List>
  );
}
