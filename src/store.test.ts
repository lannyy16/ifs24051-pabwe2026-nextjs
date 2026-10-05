import { describe, expect, it } from "vitest";
import { store } from "./store";

describe("store", () => {
  it("memuat reducer auth, users, dan posts", () => {
    expect(Object.keys(store.getState()).sort()).toEqual(["auth", "posts", "users"]);
  });
  it("state awal sesuai", () => {
    const s = store.getState();
    expect(s.auth).toEqual({ profile: null, isProfile: false });
    expect(s.users.users).toEqual([]);
    expect(s.posts.posts).toEqual([]);
  });
});
