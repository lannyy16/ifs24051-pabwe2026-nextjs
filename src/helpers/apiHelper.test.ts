import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { api, getAccessToken, putAccessToken, removeAccessToken } from "./apiHelper";

const mockFetch = (json: unknown, ok = true) => {
  const fn = vi.fn().mockResolvedValue({ ok, json: async () => json });
  vi.stubGlobal("fetch", fn);
  return fn;
};
const callUrl = (fn: ReturnType<typeof vi.fn>) => new URL(String(fn.mock.calls[0][0]));
const callInit = (fn: ReturnType<typeof vi.fn>) => fn.mock.calls[0][1] as RequestInit & { headers: Record<string, string> };

describe("token helpers", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.unstubAllGlobals());

  it("mengembalikan null saat belum ada token", () => {
    expect(getAccessToken()).toBeNull();
  });
  it("menyimpan, membaca, lalu menghapus token", () => {
    putAccessToken("abc");
    expect(getAccessToken()).toBe("abc");
    removeAccessToken();
    expect(getAccessToken()).toBeNull();
  });
  it("mengembalikan null di server (tanpa window)", () => {
    putAccessToken("abc");
    vi.stubGlobal("window", undefined);
    expect(getAccessToken()).toBeNull();
  });
});

describe("api", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.unstubAllGlobals());

  it("mengembalikan data saat sukses", async () => {
    const f = mockFetch({ success: true, data: { a: 1 } });
    await expect(api("/posts")).resolves.toEqual({ a: 1 });
    expect(callUrl(f).pathname).toContain("/posts");
    expect(callInit(f).method).toBe("GET");
  });

  it("menganggap respons tanpa flag success sebagai sukses", async () => {
    mockFetch({ data: 7 });
    await expect(api("/x")).resolves.toBe(7);
  });

  it("menyertakan header Authorization saat token ada", async () => {
    putAccessToken("tok");
    const f = mockFetch({ success: true, data: null });
    await api("/x");
    expect(callInit(f).headers.Authorization).toBe("Bearer tok");
  });

  it("tidak menyertakan Authorization bila auth: false", async () => {
    putAccessToken("tok");
    const f = mockFetch({ success: true, data: null });
    await api("/x", { auth: false });
    expect(callInit(f).headers.Authorization).toBeUndefined();
  });

  it("tidak menyertakan Authorization bila token kosong", async () => {
    const f = mockFetch({ success: true, data: null });
    await api("/x");
    expect(callInit(f).headers.Authorization).toBeUndefined();
  });

  it("mengisi query dan melewati nilai undefined", async () => {
    const f = mockFetch({ success: true, data: null });
    await api("/x", { query: { is_me: 1, search: undefined } });
    const url = callUrl(f);
    expect(url.searchParams.get("is_me")).toBe("1");
    expect(url.searchParams.has("search")).toBe(false);
  });

  it("mengirim body JSON dengan Content-Type", async () => {
    const f = mockFetch({ success: true, data: null });
    await api("/x", { method: "POST", body: { a: 1 } });
    const init = callInit(f);
    expect(init.method).toBe("POST");
    expect(init.headers["Content-Type"]).toBe("application/json");
    expect(init.body).toBe(JSON.stringify({ a: 1 }));
  });

  it("mengirim FormData apa adanya tanpa Content-Type", async () => {
    const f = mockFetch({ success: true, data: null });
    const form = new FormData();
    await api("/x", { method: "POST", body: form });
    const init = callInit(f);
    expect(init.body).toBe(form);
    expect(init.headers["Content-Type"]).toBeUndefined();
  });

  it("tanpa body tidak mengirim body", async () => {
    const f = mockFetch({ success: true, data: null });
    await api("/x");
    expect(callInit(f).body).toBeUndefined();
  });

  it("melempar pesan dari server saat success false", async () => {
    mockFetch({ success: false, message: "Email salah" }, true);
    await expect(api("/x")).rejects.toThrow("Email salah");
  });

  it("melempar error saat HTTP tidak ok", async () => {
    mockFetch({ message: "Tidak diizinkan" }, false);
    await expect(api("/x")).rejects.toThrow("Tidak diizinkan");
  });

  it.each([{ status: "fail" }, { status: "error" }])("melempar error saat status %o", async (body) => {
    mockFetch({ ...body, message: "gagal" }, true);
    await expect(api("/x")).rejects.toThrow("gagal");
  });

  it("memakai pesan bawaan bila server tidak mengirim pesan", async () => {
    mockFetch({ success: false }, false);
    await expect(api("/x")).rejects.toThrow();
  });

  it("memakai base URL langsung saat di server", async () => {
    vi.stubGlobal("window", undefined);
    const f = mockFetch({ success: true, data: 1 });
    await expect(api("/posts")).resolves.toBe(1);
    expect(String(f.mock.calls[0][0])).toMatch(/^https?:\/\//);
  });
});
