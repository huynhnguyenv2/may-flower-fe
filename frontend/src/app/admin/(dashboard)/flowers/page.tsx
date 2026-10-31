"use client";

import { CreateButton, List, useTable } from "@refinedev/antd";
import { useNavigation } from "@refinedev/core";
import { Switch, Tag } from "antd";
import { ResponsiveTable } from "@/admin/components/ResponsiveTable";
import { formatVnd } from "@/admin/format";

type FlowerRow = {
  id: string;
  name: string;
  slug: string;
  unit: string;
  unitPriceVnd: string;
  colorTags: string[];
  active: boolean;
};

export default function AdminFlowersPage() {
  const { edit } = useNavigation();
  const { tableProps } = useTable({ resource: "flowers" });

  return (
    <List title="Hoa & nguyên liệu" headerButtons={() => <CreateButton />}>
      <ResponsiveTable<FlowerRow>
        tableProps={tableProps}
        rowKey="id"
        onRowClick={(record) => edit("flowers", record.id)}
        columns={[
          { key: "name", title: "Tên", dataIndex: "name", primary: true },
          { key: "slug", title: "Slug", dataIndex: "slug", width: 160, secondary: true },
          { key: "unit", title: "ĐVT", dataIndex: "unit", width: 80 },
          {
            key: "unitPriceVnd",
            title: "Giá / đVT",
            dataIndex: "unitPriceVnd",
            width: 130,
            render: (v) => formatVnd(v as string),
          },
          {
            key: "colorTags",
            title: "Màu",
            dataIndex: "colorTags",
            render: (tags) =>
              (tags as string[])?.map((t) => <Tag key={t}>{t}</Tag>),
          },
          {
            key: "active",
            title: "Active",
            dataIndex: "active",
            width: 90,
            render: (v) => <Switch checked={v as boolean} disabled size="small" />,
          },
        ]}
      />
    </List>
  );
}
