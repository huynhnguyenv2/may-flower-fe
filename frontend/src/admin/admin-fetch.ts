import {
  ADMIN_ACCESS_TOKEN_KEY,
  ADMIN_REFRESH_TOKEN_KEY,
  adminApiBase,
} from "./constants";

type FetchOptions = {
  method?: string;
  body?: string;
  auth?: boolean;
};

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ADMIN_ACCESS_TOKEN_KEY);
}

async function refreshAccessToken(): Promise<string | null> {
  const refresh = localStorage.getItem(ADMIN_REFRESH_TOKEN_KEY);
  if (!refresh) return null;

  const res = await fetch(`${adminApiBase()}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: refresh }),
  });
  if (!res.ok) return null;

  const json = (await res.json()) as {
    data?: { accessToken: string; refreshToken?: string };
  };
  const access = json.data?.accessToken;
  if (!access) return null;

  localStorage.setItem(ADMIN_ACCESS_TOKEN_KEY, access);
  if (json.data?.refreshToken) {
    localStorage.setItem(ADMIN_REFRESH_TOKEN_KEY, json.data.refreshToken);
  }
  return access;
}

export async function adminFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { method = "GET", body, auth = true } = options;
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  if (auth) {
    let token = getAccessToken();
    if (!token) {
      throw Object.assign(new Error("Unauthorized"), { status: 401 });
    }
    headers.Authorization = `Bearer ${token}`;
  }

  let res = await fetch(`${adminApiBase()}${path}`, { method, headers, body });

  if (res.status === 401 && auth) {
    const next = await refreshAccessToken();
    if (next) {
      headers.Authorization = `Bearer ${next}`;
      res = await fetch(`${adminApiBase()}${path}`, { method, headers, body });
    }
  }

  const json = (await res.json()) as { data?: T; error?: { message?: string } };
  if (!res.ok) {
    throw Object.assign(new Error(json.error?.message ?? `HTTP ${res.status}`), {
      status: res.status,
    });
  }
  return json.data as T;
}
