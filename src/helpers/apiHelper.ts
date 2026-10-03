import { DELCOM_BASEURL } from "@/lib/config";

export const getAccessToken = () =>
  typeof window === "undefined"
    ? null
    : localStorage.getItem("token");

export const putAccessToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const removeAccessToken = () => {
  localStorage.removeItem("token");
};

type Opt = {
  method?: string;
  body?: unknown;
  query?: Record<string, string | number | undefined>;
  auth?: boolean;
};

export async function api<T = unknown>(
  path: string,
  {
    method = "GET",
    body,
    query,
    auth = true,
  }: Opt = {},
): Promise<T> {
  const url = new URL(DELCOM_BASEURL + path);

  Object.entries(query || {}).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  });

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  const token = getAccessToken();

  if (auth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let requestBody: BodyInit | undefined;

  if (body instanceof FormData) {
    requestBody = body;
  } else if (body) {
    headers["Content-Type"] = "application/json";
    requestBody = JSON.stringify(body);
  }

  const response = await fetch(url, {
    method,
    headers,
    body: requestBody,
  });

  const json = await response.json().catch(() => null);

  const failed =
    !response.ok ||
    json?.success === false ||
    json?.status === "fail" ||
    json?.status === "error";

  if (failed) {
    let message = "Terjadi kesalahan";

    if (typeof json?.message === "string") {
      message = json.message;
    }

    if (json?.data && typeof json.data === "object") {
      const details = Object.values(json.data)
        .flat()
        .filter((item) => typeof item === "string")
        .join(", ");

      if (details) {
        message = details;
      }
    }

    throw new Error(message);
  }

  return json?.data as T;
}