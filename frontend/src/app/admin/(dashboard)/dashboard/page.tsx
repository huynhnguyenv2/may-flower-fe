"use client";

import { Alert, Card, Col, List, Row, Skeleton, Statistic, Typography } from "antd";
import Link from "next/link";
import { OrderStatusTag } from "@/admin/components/StatusTags";
import { formatDateTime, formatVnd } from "@/admin/format";
import { useAdminDashboard } from "@/admin/hooks/useAdminDashboard";

export default function AdminDashboardPage() {
  const { data, loading, error } = useAdminDashboard();

  if (loading) {
    return <Skeleton active paragraph={{ rows: 8 }} />;
  }

  if (error || !data) {
    return <Alert type="error" message={error ?? "Không tải được dashboard"} showIcon />;
  }

  const { kpis } = data;

  return (
    <div className="space-y-6">
      <div>
        <Typography.Title level={3} className="!mb-1 !font-display">
          Tổng quan vận hành
        </Typography.Title>
        <Typography.Paragraph type="secondary" className="!mb-0">
          Số liệu thời gian thực từ đơn hàng, yêu cầu AI Florist và tồn kho.
        </Typography.Paragraph>
      </div>

      {data.alerts.length > 0 ? (
        <div className="space-y-2">
          {data.alerts.map((a) => (
            <Alert
              key={a.message}
              type={a.severity === "warning" ? "warning" : "info"}
              message={a.message}
              showIcon
            />
          ))}
        </div>
      ) : null}

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Đơn hôm nay" value={kpis.ordersToday} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Doanh thu hôm nay" value={formatVnd(kpis.revenueTodayVnd)} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="YC AI chờ duyệt" value={kpis.pendingAiRequests} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="7 ngày · doanh thu" value={formatVnd(kpis.revenue7dVnd)} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card title="Đơn gần đây" extra={<Link href="/admin/orders">Xem tất cả</Link>}>
            <List
              dataSource={data.recentOrders}
              locale={{ emptyText: "Chưa có đơn" }}
              renderItem={(o) => (
                <List.Item
                  actions={[
                    <Link
                      key="go"
                      href={`/admin/orders/show/${o.id}`}
                      className="inline-flex min-h-[44px] items-center px-2"
                    >
                      Chi tiết
                    </Link>,
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <span className="flex flex-wrap items-center gap-2">
                        <Link href={`/admin/orders/show/${o.id}`}>{o.orderNumber}</Link>
                        <OrderStatusTag status={o.status} />
                      </span>
                    }
                    description={`${o.customerName} · ${formatDateTime(o.createdAt)} · ${formatVnd(o.totalVnd)}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="Trạng thái đơn">
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(data.ordersByStatus).map(([status, count]) => (
                <div key={status} className="rounded-lg bg-black/[0.03] px-3 py-2">
                  <OrderStatusTag status={status} />
                  <div className="mt-1 text-xl font-medium">{count}</div>
                </div>
              ))}
            </div>
          </Card>
          <Card title="Tồn kho thấp" className="mt-4">
            <List
              size="small"
              dataSource={data.lowStock}
              locale={{ emptyText: "Ổn định" }}
              renderItem={(v) => (
                <List.Item>
                  {v.productName} ({v.sizeLabel}) — còn {v.availableQuantity}
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Sản phẩm bán chạy (số lượng dòng)">
            <List
              dataSource={data.popularProducts}
              locale={{ emptyText: "Chưa đủ dữ liệu" }}
              renderItem={(p) => (
                <List.Item>
                  {p.name} — {p.quantitySold} sp
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Add-on phổ biến (AI requests)">
            <List
              dataSource={data.popularAddons}
              locale={{ emptyText: "Chưa đủ dữ liệu" }}
              renderItem={(a) => (
                <List.Item>
                  {a.name} — {a.quantity}
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Hoạt động gần đây">
        <List
          dataSource={data.recentActivity}
          locale={{ emptyText: "Chưa có sự kiện" }}
          renderItem={(a) => (
            <List.Item>
              <List.Item.Meta
                title={`${a.action} · ${a.entityType}`}
                description={`${a.actorName ?? "Hệ thống"} · ${formatDateTime(a.createdAt)}`}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
