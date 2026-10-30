"use client";

import { CreateButton, List, useTable } from "@refinedev/antd";
import { useNavigation } from "@refinedev/core";
import { Switch, Table, Tag } from "antd";
import { formatVnd } from "@/admin/format";

export default function AdminFlowersPage() {
  const { edit } = useNavigation();
  const { tableProps } = useTable({ resource: "flowers" });

  return (
    <List title="Hoa & nguyên liệu" headerButtons={() => <CreateButton />}>
      <Table
        {...tableProps}
        rowKey="id"
        onRow={(record) => ({
          onClick: () => edit("flowers", record.id as string),
          style: { cursor: "pointer" },
        })}
      >
        <Table.Column dataIndex="name" title="Tên" />
        <Table.Column dataIndex="slug" title="Slug" width={160} />
        <Table.Column dataIndex="unit" title="ĐVT" width={80} />
        <Table.Column
          dataIndex="unitPriceVnd"
          title="Giá / đVT"
          width={130}
          render={(v: string) => formatVnd(v)}
        />
        <Table.Column
          dataIndex="colorTags"
          title="Màu"
          render={(tags: string[]) => tags?.map((t) => <Tag key={t}>{t}</Tag>)}
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
