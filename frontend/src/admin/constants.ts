export const ADMIN_ACCESS_TOKEN_KEY = "mayflower_admin_access";
export const ADMIN_REFRESH_TOKEN_KEY = "mayflower_admin_refresh";

export function adminApiBase(): string {
  const publicBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  if (!publicBase) {
    if (typeof window !== "undefined") {
      throw new Error("Missing NEXT_PUBLIC_API_URL");
    }
    return "http://localhost:3101/v1/admin";
  }
  return publicBase.replace(/\/v1\/?$/, "") + "/v1/admin";
}
