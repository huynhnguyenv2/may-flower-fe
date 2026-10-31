"use client";

import { List, useTable } from "@refinedev/antd";
import { Tag } from "antd";
import { ResponsiveTable } from "@/admin/components/ResponsiveTable";

type InventoryRow = {
  variantId: string;
  productName: string;
  sku: string;
  sizeLabel: string;
  availableQuantity: number;
};

export default function AdminInventoryPage() {
  const { tableProps } = useTable({ resource: "inventory" });

  return (
    <List title="Tồn kho — cảnh báo thấp">
      <ResponsiveTable<InventoryRow>
        tableProps={tableProps}
        rowKey="variantId"
        columns={[
          { key: "productName", title: "Sản phẩm", dataIndex: "productName", primary: true },
          {
            key: "sizeLabel",
            title: "Size",
            dataIndex: "sizeLabel",
            width: 90,
            secondary: true,
          },
          { key: "sku", title: "SKU", dataIndex: "sku", width: 100 },
          {
            key: "availableQuantity",
            title: "Còn lại",
            dataIndex: "availableQuantity",
            width: 100,
            render: (q) => {
              const quantity = q as number;
              return (
                <Tag color={quantity <= 1 ? "red" : quantity <= 3 ? "gold" : "green"}>
                  {quantity}
                </Tag>
              );
            },
          },
        ]}
      />
    </List>
  );
}
