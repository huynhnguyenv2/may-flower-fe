"use client";

import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber, Switch } from "antd";

export default function AdminAddonEditPage() {
  const { formProps, saveButtonProps } = useForm({ resource: "addons" });

  return (
    <Edit title="Sửa add-on" saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="category" label="Nhóm" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="priceVnd" label="Giá VND" rules={[{ required: true }]}>
          <InputNumber className="w-full" min={0} />
        </Form.Item>
        <Form.Item name="imageUrl" label="URL ảnh">
          <Input />
        </Form.Item>
        <Form.Item name="active" label="Active" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Edit>
  );
}
