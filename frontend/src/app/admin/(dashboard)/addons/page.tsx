"use client";

import { CreateButton, List, useTable } from "@refinedev/antd";
import { useNavigation } from "@refinedev/core";
import { Switch, Tag } from "antd";
import { ResponsiveTable } from "@/admin/components/ResponsiveTable";
import { formatVnd } from "@/admin/format";

type AddonRow = {
  id: string;
  name: string;
  category: string;
  priceVnd: string;
  occasionTags: string[];
  active: boolean;
};

export default function AdminAddonsPage() {
  const { edit } = useNavigation();
  const { tableProps } = useTable({ resource: "addons" });

  return (
    <List title="Add-on" headerButtons={() => <CreateButton />}>
      <ResponsiveTable<AddonRow>
        tableProps={tableProps}
        rowKey="id"
        onRowClick={(record) => edit("addons", record.id)}
        columns={[
          { key: "name", title: "Tên", dataIndex: "name", primary: true },
          { key: "category", title: "Nhóm", dataIndex: "category", width: 120, secondary: true },
          {
            key: "priceVnd",
            title: "Giá",
            dataIndex: "priceVnd",
            width: 120,
            render: (v) => formatVnd(v as string),
          },
          {
            key: "occasionTags",
            title: "Dịp",
            dataIndex: "occasionTags",
            render: (tags) =>
              (tags as string[])?.slice(0, 3).map((t) => <Tag key={t}>{t}</Tag>),
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
