"use client";

import { Create, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber, Switch } from "antd";

export default function AdminFlowerCreatePage() {
  const { formProps, saveButtonProps } = useForm({ resource: "flowers" });

  return (
    <Create title="Thêm hoa / nguyên liệu" saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item name="slug" label="Slug" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="unit" label="Đơn vị tính" rules={[{ required: true }]}>
          <Input placeholder="bông, cành, gói…" />
        </Form.Item>
        <Form.Item name="unitPriceVnd" label="Giá VND (số nguyên)" rules={[{ required: true }]}>
          <InputNumber className="w-full" min={0} />
        </Form.Item>
        <Form.Item name="colorTags" label="Thẻ màu (cách nhau dấu phẩy)">
          <Input placeholder="hồng, trắng" />
        </Form.Item>
        <Form.Item name="active" label="Đang bán" valuePropName="checked" initialValue>
          <Switch />
        </Form.Item>
      </Form>
    </Create>
  );
}
