"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { createSupportSession, sendSupportMessage } from "@/lib/api";

type ChatLine = { role: "user" | "assistant"; content: string };

const STORAGE_KEY = "mayflower-support-session";

export function SupportChatWidget() {
  const t = useTranslations("supportChat");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [lines, setLines] = useState<ChatLine[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [booting, setBooting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && lines.length === 0 && !booting) {
      setLines([{ role: "assistant", content: t("welcome") }]);
    }
  }, [open, lines.length, booting, t]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [lines, loading]);

  const ensureSession = useCallback(async () => {
    if (sessionId) return sessionId;
    const stored =
      typeof window !== "undefined" ? sessionStorage.getItem(STORAGE_KEY) : null;
    if (stored) {
      setSessionId(stored);
      return stored;
    }
    setBooting(true);
    try {
      const loc = locale === "en" ? "en" : "vi";
      const session = await createSupportSession(loc);
      sessionStorage.setItem(STORAGE_KEY, session.id);
      setSessionId(session.id);
      return session.id;
    } finally {
      setBooting(false);
    }
  }, [sessionId, locale]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setLines((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);
    try {
      const id = await ensureSession();
      const { message } = await sendSupportMessage(id, text);
      setLines((prev) => [...prev, { role: "assistant", content: message }]);
    } catch {
      setLines((prev) => [
        ...prev,
        { role: "assistant", content: t("error") },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open ? (
        <div
          className="flex h-[min(32rem,70vh)] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/10"
          role="dialog"
          aria-label={t("title")}
        >
          <header className="flex items-center justify-between border-b border-gold/30 bg-paper px-4 py-3">
            <div>
              <p className="font-display text-lg text-umber">{t("title")}</p>
              <p className="text-xs text-ink/60">{t("subtitle")}</p>
            </div>
            <button
              type="button"
              className="rounded-full p-2 text-ink/60 hover:bg-gold/20"
              aria-label={t("close")}
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </header>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {lines.map((line, i) => (
              <div
                key={`${line.role}-${i}`}
                className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                  line.role === "user"
                    ? "ml-auto bg-umber text-white"
                    : "bg-gold/15 text-ink"
                }`}
              >
                {line.content}
              </div>
            ))}
            {loading ? (
              <p className="text-xs text-ink/50">{t("typing")}</p>
            ) : null}
          </div>

          <form onSubmit={(ev) => void handleSend(ev)} className="border-t border-gold/30 p-3">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("placeholder")}
                className="min-w-0 flex-1 rounded-full border border-gold/40 px-4 py-2 text-sm outline-none focus:border-umber"
                disabled={loading || booting}
              />
              <button
                type="submit"
                disabled={loading || booting || !input.trim()}
                className="rounded-full bg-umber px-4 py-2 text-sm text-white disabled:opacity-40"
              >
                {t("send")}
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] text-ink/50">
              {t("conciergeHint")}{" "}
              <Link href="/find-your-flowers" className="underline">
                {t("conciergeLink")}
              </Link>
            </p>
          </form>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-full bg-umber px-5 py-3 text-sm font-medium text-white shadow-lg transition hover:bg-umber/90"
        aria-expanded={open}
      >
        {open ? t("close") : t("open")}
      </button>
    </div>
  );
}
