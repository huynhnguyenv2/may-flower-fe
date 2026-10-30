import type { ThemeConfig } from "antd";

/** nau.fleur admin — warm paper / umber palette aligned with storefront. */
export const adminTheme: ThemeConfig = {
  token: {
    colorPrimary: "#5C4033",
    colorInfo: "#5C4033",
    colorSuccess: "#4A7C59",
    colorWarning: "#C4A484",
    colorError: "#B44A4A",
    colorBgLayout: "#F3EFEA",
    colorBgContainer: "#FAF8F5",
    colorText: "#1A1A1A",
    colorTextSecondary: "#5C5C5C",
    borderRadius: 10,
    fontFamily: "var(--font-sans), 'DM Sans', system-ui, sans-serif",
    fontSize: 14,
  },
  components: {
    Layout: {
      siderBg: "#1A1A1A",
      triggerBg: "#2A2A2A",
      headerBg: "#FAF8F5",
    },
    Menu: {
      darkItemBg: "#1A1A1A",
      darkSubMenuItemBg: "#141414",
      darkItemSelectedBg: "#5C4033",
    },
    Table: {
      headerBg: "#F0EBE4",
      rowHoverBg: "#F7F3EE",
    },
    Card: {
      paddingLG: 20,
    },
  },
};
