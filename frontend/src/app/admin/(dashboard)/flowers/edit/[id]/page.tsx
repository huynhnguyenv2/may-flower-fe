"use client";

import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber, Switch } from "antd";

export default function AdminFlowerEditPage() {
  const { formProps, saveButtonProps, query } = useForm({ resource: "flowers" });
  const record = query?.data?.data as { colorTags?: string[] } | undefined;

  return (
    <Edit title="Sửa hoa / nguyên liệu" saveButtonProps={saveButtonProps}>
      <Form
        {...formProps}
        layout="vertical"
        initialValues={{
          ...formProps.initialValues,
          colorTags: record?.colorTags?.join(", "),
        }}
      >
        <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="unit" label="Đơn vị tính" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="unitPriceVnd" label="Giá VND" rules={[{ required: true }]}>
          <InputNumber className="w-full" min={0} />
        </Form.Item>
        <Form.Item name="active" label="Active" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Edit>
  );
}
