"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Card, Input, Spin, Tag, Typography } from "antd";
import { adminFetch } from "./admin-fetch";

type Line = { role: "user" | "assistant"; content: string };

export function AdminAssistantChat() {
  const [lines, setLines] = useState<Line[]>([
    {
      role: "assistant",
      content:
        "Xin chào! Mình là trợ lý vận hành nau.fleur — hỏi về đơn hàng, tồn kho, hoặc quy trình giao hoa nhé.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<{
    ordersToday: number;
    pendingPayment: number;
    revenueTodayVnd: string;
  } | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void adminFetch<typeof stats>("/assistant/stats")
      .then(setStats)
      .catch(() => setStats(null));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const nextLines: Line[] = [...lines, { role: "user", content: text }];
    setLines(nextLines);
    setLoading(true);
    try {
      const res = await adminFetch<{ message: string; source: string }>("/assistant/chat", {
        method: "POST",
        body: JSON.stringify({ messages: nextLines }),
      });
      setLines([...nextLines, { role: "assistant", content: res.message }]);
    } catch {
      setLines([
        ...nextLines,
        {
          role: "assistant",
          content: "Không gửi được — kiểm tra đăng nhập hoặc API admin.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
      {stats ? (
        <Typography.Text type="secondary" className="text-sm leading-relaxed">
          Hôm nay: {stats.ordersToday} đơn · chờ TT: {stats.pendingPayment} · doanh thu{" "}
          {stats.revenueTodayVnd} VND
        </Typography.Text>
      ) : null}

      <div className="max-h-[min(55vh,420px)] space-y-3 overflow-y-auto rounded-lg border border-neutral-200 bg-white p-3 sm:p-4">
        {lines.map((line, i) => (
          <Card
            key={`${line.role}-${i}`}
            size="small"
            type={line.role === "user" ? "inner" : undefined}
            title={line.role === "user" ? "Bạn" : "Trợ lý"}
          >
            <Typography.Paragraph className="mb-0 whitespace-pre-wrap text-[15px]">
              {line.content}
            </Typography.Paragraph>
          </Card>
        ))}
        {loading ? <Spin size="small" /> : null}
        <div ref={bottomRef} />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <Input.TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Hỏi trợ lý (vd: còn bao nhiêu đơn chờ thanh toán?)"
          autoSize={{ minRows: 2, maxRows: 4 }}
          className="!text-base"
          onPressEnter={(e) => {
            if (!e.shiftKey) {
              e.preventDefault();
              void send();
            }
          }}
        />
        <Button
          type="primary"
          className="!min-h-[44px] sm:!min-w-[88px]"
          block
          onClick={() => void send()}
          disabled={loading || !input.trim()}
        >
          Gửi
        </Button>
      </div>
      <Tag color="blue">Dữ liệu tóm tắt từ DB; không tự sửa đơn/tồn kho</Tag>
    </div>
  );
}
