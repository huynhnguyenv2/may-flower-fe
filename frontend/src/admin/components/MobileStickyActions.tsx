"use client";

import type { ReactNode } from "react";
import { useAdminBreakpoint } from "@/admin/hooks/useAdminBreakpoint";

export function MobileStickyActions({ children }: { children: ReactNode }) {
  const { isMobile } = useAdminBreakpoint();
  if (!isMobile) return null;

  return (
    <>
      <div className="admin-sticky-actions-spacer" aria-hidden />
      <div
        className="fixed inset-x-0 bottom-0 z-30 border-t border-black/10 bg-[#FAF8F5]/95 px-4 py-3 backdrop-blur-md"
        style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto flex max-w-lg flex-wrap gap-2 [&_.ant-btn]:min-h-[44px] [&_.ant-btn]:flex-1">
          {children}
        </div>
      </div>
    </>
  );
}
