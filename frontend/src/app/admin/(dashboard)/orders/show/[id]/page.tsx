"use client";

import { Show } from "@refinedev/antd";
import { useShow, useUpdate } from "@refinedev/core";
import { Card, Col, Descriptions, Row, Select, Table, Timeline, Typography } from "antd";
import Link from "next/link";
import { ORDER_STATUS, OrderStatusTag } from "@/admin/components/StatusTags";
import { formatDateTime, formatVnd } from "@/admin/format";

const STATUS_OPTIONS = Object.entries(ORDER_STATUS).map(([value, { label }]) => ({
  value,
  label,
}));

type OrderDetail = {
  id: string;
  orderNumber: string;
  status: string;
  channel: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  customerId: string;
  recipient: Record<string, unknown>;
  subtotalVnd: string;
  deliveryFeeVnd: string;
  totalVnd: string;
  messageCard?: string | null;
  createdAt: string;
  updatedAt: string;
  deliverySlot: { date: string; startTime: string; endTime: string };
  productionStatus: string | null;
  items: {
    id: string;
    productName: string;
    variantLabel: string;
    quantity: number;
    unitPriceVnd: string;
    lineTotalVnd: string;
  }[];
  timeline: {
    id: string;
    action: string;
    actorName: string | null;
    createdAt: string;
  }[];
};

export default function AdminOrderShowPage() {
  const { query } = useShow({ resource: "orders" });
  const { mutate: updateOrder, mutation } = useUpdate();
  const record = query.data?.data as OrderDetail | undefined;

  return (
    <Show title={record ? `Đơn ${record.orderNumber}` : "Chi tiết đơn"} isLoading={query.isLoading}>
      {record ? (
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Card title="Thông tin đơn" className="mb-4">
              <Descriptions column={{ xs: 1, sm: 2 }} size="small">
                <Descriptions.Item label="Mã">{record.orderNumber}</Descriptions.Item>
                <Descriptions.Item label="Kênh">{record.channel}</Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  <OrderStatusTag status={record.status} />
                </Descriptions.Item>
                <Descriptions.Item label="Sản xuất">
                  {record.productionStatus ?? "—"}
                </Descriptions.Item>
                <Descriptions.Item label="Tạo lúc">{formatDateTime(record.createdAt)}</Descriptions.Item>
                <Descriptions.Item label="Cập nhật">{formatDateTime(record.updatedAt)}</Descriptions.Item>
              </Descriptions>
              <div className="mt-4">
                <Typography.Text type="secondary">Chuyển trạng thái</Typography.Text>
                <Select
                  className="mt-1 block max-w-xs"
                  value={record.status}
                  options={STATUS_OPTIONS}
                  loading={mutation.isPending}
                  onChange={(status) =>
                    updateOrder({ resource: "orders", id: record.id, values: { status } })
                  }
                />
              </div>
            </Card>

            <Card title="Sản phẩm / cấu hình">
              <Table
                rowKey="id"
                pagination={false}
                size="small"
                dataSource={record.items}
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
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Khách hàng" className="mb-4">
              <Typography.Paragraph className="!mb-1">{record.customerName}</Typography.Paragraph>
              <Typography.Paragraph className="!mb-1">{record.customerPhone}</Typography.Paragraph>
              {record.customerEmail ? (
                <Typography.Paragraph className="!mb-0">{record.customerEmail}</Typography.Paragraph>
              ) : null}
              <Link href={`/admin/customers/show/${record.customerId}`} className="text-sm">
                Xem hồ sơ khách
              </Link>
            </Card>

            <Card title="Giao hàng" className="mb-4">
              <Typography.Paragraph className="!mb-1">
                {record.deliverySlot.date} · {record.deliverySlot.startTime}–
                {record.deliverySlot.endTime}
              </Typography.Paragraph>
              <Typography.Paragraph type="secondary" className="text-xs">
                Phí giao: {formatVnd(record.deliveryFeeVnd)}
              </Typography.Paragraph>
              <pre className="mt-2 max-h-40 overflow-auto rounded bg-black/[0.04] p-2 text-xs">
                {JSON.stringify(record.recipient, null, 2)}
              </pre>
            </Card>

            <Card title="Thanh toán">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Tạm tính">{formatVnd(record.subtotalVnd)}</Descriptions.Item>
                <Descriptions.Item label="Phí giao">{formatVnd(record.deliveryFeeVnd)}</Descriptions.Item>
                <Descriptions.Item label="Tổng">
                  <Typography.Text strong>{formatVnd(record.totalVnd)}</Typography.Text>
                </Descriptions.Item>
              </Descriptions>
              {record.messageCard ? (
                <Typography.Paragraph className="mt-3 text-sm italic">
                  Thiệp: {record.messageCard}
                </Typography.Paragraph>
              ) : null}
            </Card>
          </Col>

          <Col span={24}>
            <Card title="Nhật ký xử lý">
              <Timeline
                items={record.timeline.map((t) => ({
                  children: (
                    <div>
                      <Typography.Text strong>{t.action}</Typography.Text>
                      <div className="text-xs text-ink/60">
                        {t.actorName ?? "Hệ thống"} · {formatDateTime(t.createdAt)}
                      </div>
                    </div>
                  ),
                }))}
              />
            </Card>
          </Col>
        </Row>
      ) : null}
    </Show>
  );
}
