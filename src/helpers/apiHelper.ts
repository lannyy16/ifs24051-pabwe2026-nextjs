import { DELCOM_BASEURL, API_PROXY_PATH } from "@/lib/config";

export const getAccessToken = () => (typeof window === "undefined" ? null : localStorage.getItem("token"));
export const putAccessToken = (t: string) => localStorage.setItem("token", t);
export const removeAccessToken = () => localStorage.removeItem("token");

type Opt = { method?: string; body?: unknown; query?: Record<string, string | number | undefined>; auth?: boolean };

export async function api<T = unknown>(path: string, { method = "GET", body, query, auth = true }: Opt = {}): Promise<T> {
  const isBrowser = typeof window !== "undefined";
  const base = isBrowser ? API_PROXY_PATH : DELCOM_BASEURL;
  const url = new URL(base + path, isBrowser ? window.location.origin : undefined);
  Object.entries(query || {}).forEach(([k, v]) => v !== undefined && url.searchParams.set(k, String(v)));

  const headers: Record<string, string> = {};
  const t = getAccessToken();
  if (auth && t) headers.Authorization = `Bearer ${t}`;

  let b: BodyInit | undefined;
  if (body instanceof FormData) b = body;
  else if (body) { headers["Content-Type"] = "application/json"; b = JSON.stringify(body); }

  const res = await fetch(url, { method, headers, body: b });
  const json = await res.json();
  const failed = !res.ok || json.success === false || json.status === "fail" || json.status === "error";
  if (failed) throw new Error(json.message || "Terjadi kesalahan");
  return json.data as T;
}