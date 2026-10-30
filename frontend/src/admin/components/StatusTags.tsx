"use client";

import { Tag } from "antd";

const ORDER_STATUS: Record<string, { label: string; color: string }> = {
  pending_payment: { label: "Chờ thanh toán", color: "gold" },
  confirmed: { label: "Đã xác nhận", color: "blue" },
  in_production: { label: "Đang làm hoa", color: "processing" },
  out_for_delivery: { label: "Đang giao", color: "cyan" },
  delivered: { label: "Đã giao", color: "success" },
  cancelled: { label: "Đã hủy", color: "default" },
};

const REQUEST_STATUS: Record<string, { label: string; color: string }> = {
  pending_review: { label: "Chờ duyệt", color: "gold" },
  approved: { label: "Đã duyệt", color: "green" },
  declined: { label: "Từ chối", color: "red" },
  cancelled: { label: "Đã hủy", color: "default" },
  converted: { label: "Đã chuyển đơn", color: "blue" },
};

export function OrderStatusTag({ status }: { status: string }) {
  const meta = ORDER_STATUS[status] ?? { label: status, color: "default" };
  return <Tag color={meta.color}>{meta.label}</Tag>;
}

export function CustomRequestStatusTag({ status }: { status: string }) {
  const meta = REQUEST_STATUS[status] ?? { label: status, color: "default" };
  return <Tag color={meta.color}>{meta.label}</Tag>;
}

export { ORDER_STATUS };
