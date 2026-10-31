"use client";

import { Grid } from "antd";

/** Matches AdminShell sidebar breakpoint (`lg` = 992px in Ant Design 5). */
export function useAdminBreakpoint() {
  const screens = Grid.useBreakpoint();
  const isDesktop = screens.lg === true;
  const isMobile = !isDesktop;
  const isCompact = !screens.md;
  return { screens, isDesktop, isMobile, isCompact };
}
