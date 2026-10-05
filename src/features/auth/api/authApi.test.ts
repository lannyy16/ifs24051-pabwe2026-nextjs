import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/helpers/apiHelper", () => ({ api: vi.fn().mockResolvedValue("ok") }));

import { api } from "@/helpers/apiHelper";
import { login, register } from "./authApi";

describe("authApi", () => {
  beforeEach(() => vi.mocked(api).mockClear());

  it("login memanggil POST /auth/login tanpa auth", async () => {
    await expect(login("a@b.c", "pw")).resolves.toBe("ok");
    expect(api).toHaveBeenCalledWith("/auth/login", { method: "POST", body: { email: "a@b.c", password: "pw" }, auth: false });
  });
  it("register memanggil POST /auth/register tanpa auth", async () => {
    await register("Nama", "a@b.c", "pw");
    expect(api).toHaveBeenCalledWith("/auth/register", { method: "POST", body: { name: "Nama", email: "a@b.c", password: "pw" }, auth: false });
  });
});
