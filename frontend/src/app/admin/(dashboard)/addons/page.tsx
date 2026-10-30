"use client";

import { CreateButton, List, useTable } from "@refinedev/antd";
import { useNavigation } from "@refinedev/core";
import { Switch, Table, Tag } from "antd";
import { formatVnd } from "@/admin/format";

export default function AdminAddonsPage() {
  const { edit } = useNavigation();
  const { tableProps } = useTable({ resource: "addons" });

  return (
    <List title="Add-on" headerButtons={() => <CreateButton />}>
      <Table
        {...tableProps}
        rowKey="id"
        onRow={(record) => ({
          onClick: () => edit("addons", record.id as string),
          style: { cursor: "pointer" },
        })}
      >
        <Table.Column dataIndex="name" title="Tên" />
        <Table.Column dataIndex="category" title="Nhóm" width={120} />
        <Table.Column
          dataIndex="priceVnd"
          title="Giá"
          width={120}
          render={(v: string) => formatVnd(v)}
        />
        <Table.Column
          dataIndex="occasionTags"
          title="Dịp"
          render={(tags: string[]) => tags?.slice(0, 3).map((t) => <Tag key={t}>{t}</Tag>)}
        />
        <Table.Column
          dataIndex="active"
          title="Active"
          width={90}
          render={(v: boolean) => <Switch checked={v} disabled size="small" />}
        />
      </Table>
    </List>
  );
}
