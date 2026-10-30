export function formatVnd(value: string | number | undefined | null): string {
  if (value == null || value === "") return "—";
  const n = typeof value === "string" ? parseInt(value, 10) : value;
  if (!Number.isFinite(n)) return String(value);
  return new Intl.NumberFormat("vi-VN").format(n) + " ₫";
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  });
}
