import { describe, expect, it, vi } from "vitest";

vi.mock("../api/userApi", () => ({ getUsers: vi.fn() }));

import { makeStore } from "@/test-utils";
import type { User } from "@/types";
import { getUsers } from "../api/userApi";
import reducer, { asyncLoadUsers } from "./reducer";

const user = { id: "1", name: "Budi" } as unknown as User;

describe("users reducer", () => {
  it("fulfilled mengisi daftar pengguna", () => {
    expect(reducer({ users: [] }, asyncLoadUsers.fulfilled([user], "r", undefined)).users).toEqual([user]);
  });
  it("thunk asyncLoadUsers memanggil API dengan kata kunci", async () => {
    vi.mocked(getUsers).mockResolvedValue({ users: [user] });
    const store = makeStore();
    await store.dispatch(asyncLoadUsers("bud"));
    expect(getUsers).toHaveBeenCalledWith("bud");
    expect(store.getState().users.users).toEqual([user]);
  });
});
