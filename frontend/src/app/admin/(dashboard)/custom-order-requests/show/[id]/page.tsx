"use client";

import { Show } from "@refinedev/antd";
import { useNavigation, useShow, useUpdate } from "@refinedev/core";
import { Button, Card, Col, Image, List, Row, Space, Tabs, Tag, Typography, message } from "antd";
import { useState } from "react";
import { DesignImageGallery } from "@/admin/components/DesignImageGallery";
import { MobileStickyActions } from "@/admin/components/MobileStickyActions";
import { CustomRequestStatusTag } from "@/admin/components/StatusTags";
import { formatDateTime, formatVnd } from "@/admin/format";
import { adminFetch } from "@/admin/admin-fetch";

type RequestDetail = {
  id: string;
  requestNumber: string;
  status: string;
  convertedOrderId?: string | null;
  customer: { name: string; phone: string; email?: string | null };
  pricing: { totalVnd?: string; lines?: { label: string; amountVnd: string }[] };
  configuration: unknown;
  conversationSummary?: string;
  messageCard?: string | null;
  instructions?: string | null;
  referenceImageUrl?: string | null;
  addons: { name: string; quantity: number; unitPriceVnd: string }[];
  designConcepts: {
    id: string;
    name: string;
    status: string;
    descriptionVi: string;
    palette: string;
    estimatedSubtotalVnd: string;
    images: { storageUrl: string; disclaimer: string }[];
  }[];
  messages: { role: string; content: string; createdAt: string }[];
  createdAt: string;
};

function RequestActionButtons({
  record,
  mutation,
  converting,
  updateStatus,
  convertToOrder,
  showOrder,
}: {
  record: RequestDetail;
  mutation: { isPending: boolean };
  converting: boolean;
  updateStatus: (values: { status: string }) => void;
  convertToOrder: () => void;
  showOrder: (id: string) => void;
}) {
  return (
    <>
      {record.status === "pending_review" ? (
        <>
          <Button
            type="primary"
            block
            loading={mutation.isPending}
            onClick={() => updateStatus({ status: "approved" })}
          >
            Duyệt
          </Button>
          <Button
            danger
            block
            loading={mutation.isPending}
            onClick={() => updateStatus({ status: "declined" })}
          >
            Từ chối
          </Button>
        </>
      ) : null}
      {record.status === "approved" ? (
        <Button type="primary" block loading={converting} onClick={convertToOrder}>
          Chuyển thành đơn hàng
        </Button>
      ) : null}
      {record.convertedOrderId ? (
        <Button block onClick={() => showOrder(record.convertedOrderId!)}>
          Xem đơn đã tạo
        </Button>
      ) : null}
    </>
  );
}

export default function AdminCustomOrderRequestShowPage() {
  const { query } = useShow({ resource: "custom-order-requests" });
  const { mutate: updateStatus, mutation } = useUpdate();
  const { show } = useNavigation();
  const [converting, setConverting] = useState(false);
  const record = query.data?.data as RequestDetail | undefined;

  async function convertToOrder() {
    if (!record) return;
    setConverting(true);
    try {
      const res = await adminFetch<{ orderId: string; orderNumber: string }>(
        `/custom-order-requests/${record.id}/convert`,
        { method: "POST", body: "{}" },
      );
      message.success(`Đã tạo đơn ${res.orderNumber}`);
      await query.refetch();
      show("orders", res.orderId);
    } catch (e) {
      message.error(e instanceof Error ? e.message : "Không chuyển được sang đơn");
    } finally {
      setConverting(false);
    }
  }

  function patchStatus(values: { status: string }) {
    if (!record) return;
    updateStatus({
      resource: "custom-order-requests",
      id: record.id,
      values,
    });
  }

  const headerButtons = record ? (
    <Space wrap className="max-lg:!hidden">
      <RequestActionButtons
        record={record}
        mutation={mutation}
        converting={converting}
        updateStatus={patchStatus}
        convertToOrder={() => void convertToOrder()}
        showOrder={(id) => show("orders", id)}
      />
    </Space>
  ) : null;

  return (
    <Show
      title={record ? record.requestNumber : "Yêu cầu AI Florist"}
      isLoading={query.isLoading}
      headerButtons={() => headerButtons}
    >
      {record ? (
        <>
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={10} className="order-1 lg:order-2">
              <Card size="small" className="mb-4">
                <CustomRequestStatusTag status={record.status} />
                <Typography.Paragraph className="mt-2 !mb-0">
                  {record.customer.name} · {record.customer.phone}
                </Typography.Paragraph>
                {record.conversationSummary ? (
                  <Typography.Paragraph type="secondary" className="mt-2 text-sm">
                    {record.conversationSummary}
                  </Typography.Paragraph>
                ) : null}
              </Card>
              {record.referenceImageUrl ? (
                <Card title="Ảnh tham chiếu" size="small" className="mb-4">
                  <Image src={record.referenceImageUrl} alt="" className="w-full rounded-lg" />
                </Card>
              ) : null}
              <Card title="Giá (snapshot)" size="small" className="mb-4">
                <Typography.Text strong className="text-lg">
                  {formatVnd(record.pricing.totalVnd)}
                </Typography.Text>
                <ul className="mt-2 space-y-1 text-sm">
                  {record.pricing.lines?.map((l) => (
                    <li key={l.label} className="flex justify-between gap-2">
                      <span>{l.label}</span>
                      <span>{formatVnd(l.amountVnd)}</span>
                    </li>
                  ))}
                </ul>
              </Card>
              {record.addons.length > 0 ? (
                <Card title="Add-on" size="small" className="mb-4">
                  <ul className="space-y-2 text-sm">
                    {record.addons.map((a) => (
                      <li key={a.name} className="flex justify-between gap-2">
                        <span>
                          {a.name} × {a.quantity}
                        </span>
                        <span>{formatVnd(a.unitPriceVnd)}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ) : null}
              {(record.messageCard || record.instructions) && (
                <Card title="Ghi chú khách" size="small">
                  {record.messageCard ? <p className="text-sm italic">{record.messageCard}</p> : null}
                  {record.instructions ? (
                    <Typography.Paragraph className="text-sm">{record.instructions}</Typography.Paragraph>
                  ) : null}
                </Card>
              )}
            </Col>

            <Col xs={24} lg={14} className="order-2 lg:order-1">
              <Tabs
                items={[
                  {
                    key: "designs",
                    label: "Thiết kế AI",
                    children: (
                      <div className="space-y-4">
                        {record.designConcepts.length === 0 ? (
                          <Typography.Text type="secondary">
                            Không có concept lưu trong phiên.
                          </Typography.Text>
                        ) : (
                          record.designConcepts.map((c) => (
                            <Card
                              key={c.id}
                              size="small"
                              title={
                                <span className="flex flex-wrap items-center gap-2">
                                  {c.name}
                                  <Tag>{c.status}</Tag>
                                  <Tag color={c.palette}>{c.palette}</Tag>
                                </span>
                              }
                            >
                              <Typography.Paragraph className="text-sm">{c.descriptionVi}</Typography.Paragraph>
                              <Typography.Text type="secondary">
                                Ước tính: {formatVnd(c.estimatedSubtotalVnd)}
                              </Typography.Text>
                              <div className="mt-3">
                                <DesignImageGallery images={c.images} />
                              </div>
                            </Card>
                          ))
                        )}
                      </div>
                    ),
                  },
                  {
                    key: "chat",
                    label: "Hội thoại",
                    children: (
                      <List
                        dataSource={record.messages}
                        renderItem={(m) => (
                          <List.Item className="!px-0">
                            <Card
                              size="small"
                              className="w-full"
                              title={`${m.role} · ${formatDateTime(m.createdAt)}`}
                            >
                              <Typography.Paragraph className="mb-0 whitespace-pre-wrap text-[15px] leading-relaxed">
                                {m.content}
                              </Typography.Paragraph>
                            </Card>
                          </List.Item>
                        )}
                      />
                    ),
                  },
                  {
                    key: "config",
                    label: "Cấu hình",
                    children: (
                      <pre className="max-h-[50vh] overflow-auto rounded-lg bg-black/[0.04] p-3 text-xs">
                        {JSON.stringify(record.configuration, null, 2)}
                      </pre>
                    ),
                  },
                ]}
              />
            </Col>
          </Row>

          <MobileStickyActions>
            <RequestActionButtons
              record={record}
              mutation={mutation}
              converting={converting}
              updateStatus={patchStatus}
              convertToOrder={() => void convertToOrder()}
              showOrder={(id) => show("orders", id)}
            />
          </MobileStickyActions>
        </>
      ) : null}
    </Show>
  );
}
