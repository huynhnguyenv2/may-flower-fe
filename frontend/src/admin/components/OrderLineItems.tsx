"use client";

import { Table } from "antd";
import { formatVnd } from "@/admin/format";

type LineItem = {
  id: string;
  productName: string;
  variantLabel: string;
  quantity: number;
  unitPriceVnd: string;
  lineTotalVnd: string;
};

function MobileLines({ items }: { items: LineItem[] }) {
  return (
    <ul className="admin-order-lines-mobile space-y-3">
      {items.map((item) => (
        <li
          key={item.id}
          className="rounded-xl border border-black/5 bg-black/[0.02] px-3 py-3 text-sm"
        >
          <div className="font-medium">{item.productName}</div>
          <div className="mt-1 text-ink/60">{item.variantLabel}</div>
          <div className="mt-2 flex justify-between">
            <span>
              {item.quantity} × {formatVnd(item.unitPriceVnd)}
            </span>
            <span className="font-medium">{formatVnd(item.lineTotalVnd)}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

function DesktopTable({ items }: { items: LineItem[] }) {
  return (
    <div className="admin-order-lines-desktop">
      <Table
        rowKey="id"
        pagination={false}
        size="small"
        dataSource={items}
        columns={[
          { title: "Sản phẩm", dataIndex: "productName" },
          { title: "Biến thể", dataIndex: "variantLabel", width: 100 },
          { title: "SL", dataIndex: "quantity", width: 60 },
          {
            title: "Đơn giá",
            dataIndex: "unitPriceVnd",
            render: (v: string) => formatVnd(v),
          },
          {
            title: "Thành tiền",
            dataIndex: "lineTotalVnd",
            render: (v: string) => formatVnd(v),
          },
        ]}
      />
    </div>
  );
}

export function OrderLineItems({ items }: { items: LineItem[] }) {
  return (
    <>
      <MobileLines items={items} />
      <DesktopTable items={items} />
    </>
  );
}
