export const dynamic = "force-dynamic";

import { formatVnd } from "@may-flower/shared";
import { getOrder } from "@/lib/api";

type Props = { params: Promise<{ orderNumber: string }> };

export default async function OrderConfirmationPage({ params }: Props) {
  const { orderNumber } = await params;
  const order = await getOrder(orderNumber);

  return (
    <div className="max-w-lg">
      <h1 className="font-display text-3xl text-umber">Cảm ơn bạn!</h1>
      <p className="mt-2 text-ink/70">Đơn hàng đã được ghi nhận.</p>
      <dl className="mt-8 space-y-3 rounded-xl bg-white p-6 ring-1 ring-black/5 text-sm">
        <div className="flex justify-between">
          <dt className="text-ink/60">Mã đơn</dt>
          <dd className="font-medium">{order.orderNumber}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-ink/60">Trạng thái</dt>
          <dd>{order.status}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-ink/60">Giao hàng</dt>
          <dd>
            {order.deliverySlot.date} · {order.deliverySlot.startTime}–
            {order.deliverySlot.endTime}
          </dd>
        </div>
        <div className="flex justify-between border-t pt-3 font-medium">
          <dt>Tổng thanh toán</dt>
          <dd className="text-umber">{formatVnd(order.totalVnd)}</dd>
        </div>
      </dl>
    </div>
  );
}
