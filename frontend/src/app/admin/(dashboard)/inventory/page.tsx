"use client";

import { List, useTable } from "@refinedev/antd";
import { Tag, Table } from "antd";

export default function AdminInventoryPage() {
  const { tableProps } = useTable({ resource: "inventory" });

  return (
    <List title="Tồn kho — cảnh báo thấp">
      <Table {...tableProps} rowKey="variantId" size="middle">
        <Table.Column dataIndex="productName" title="Sản phẩm" />
        <Table.Column dataIndex="sku" title="SKU" width={100} />
        <Table.Column dataIndex="sizeLabel" title="Size" width={90} />
        <Table.Column
          dataIndex="availableQuantity"
          title="Còn lại"
          width={100}
          render={(q: number) => (
            <Tag color={q <= 1 ? "red" : q <= 3 ? "gold" : "green"}>{q}</Tag>
          )}
        />
      </Table>
    </List>
  );
}
