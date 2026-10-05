import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/helpers/apiHelper", () => ({ api: vi.fn().mockResolvedValue("ok") }));

import { api } from "@/helpers/apiHelper";
import { changePassword, getUsers, updateMe, uploadPhoto } from "./userApi";

const mocked = vi.mocked(api);

describe("userApi", () => {
  beforeEach(() => mocked.mockClear());

  it("getUsers meneruskan kata kunci pencarian", async () => {
    await getUsers("budi");
    expect(mocked).toHaveBeenCalledWith("/users", { query: { search: "budi" } });
  });
  it("getUsers tanpa kata kunci", async () => {
    await getUsers();
    expect(mocked).toHaveBeenCalledWith("/users", { query: { search: undefined } });
  });
  it("updateMe", async () => {
    await updateMe("Nama", "a@b.c");
    expect(mocked).toHaveBeenCalledWith("/users/me", { method: "PUT", body: { name: "Nama", email: "a@b.c" } });
  });
  it("uploadPhoto mengirim FormData berisi foto", async () => {
    await uploadPhoto(new File(["x"], "p.png", { type: "image/png" }));
    const [path, opt] = mocked.mock.calls[0] as [string, { method: string; body: FormData }];
    expect(path).toBe("/users/me/photo");
    expect(opt.method).toBe("POST");
    expect(opt.body.get("photo")).toBeInstanceOf(File);
  });
  it("changePassword", async () => {
    await changePassword("lama", "baru");
    expect(mocked).toHaveBeenCalledWith("/users/me/password", { method: "PUT", body: { password: "lama", new_password: "baru" } });
  });
});
