import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/helpers/apiHelper", () => ({ api: vi.fn(), getAccessToken: vi.fn(), removeAccessToken: vi.fn() }));

import { api, getAccessToken, removeAccessToken } from "@/helpers/apiHelper";
import { makeStore } from "@/test-utils";
import type { User } from "@/types";
import { asyncLoadProfile, isAuthLogout } from "./reducer";

const user = { id: "1", name: "Budi" } as unknown as User;

describe("auth reducer", () => {
  beforeEach(() => {
    vi.mocked(api).mockReset();
    vi.mocked(getAccessToken).mockReset();
    vi.mocked(removeAccessToken).mockReset();
  });

  it("tanpa token: profil null dan isProfile true", async () => {
    vi.mocked(getAccessToken).mockReturnValue(null);
    const store = makeStore();
    await store.dispatch(asyncLoadProfile());
    expect(store.getState().auth).toEqual({ profile: null, isProfile: true });
    expect(api).not.toHaveBeenCalled();
  });

  it("dengan token: memuat profil dari API", async () => {
    vi.mocked(getAccessToken).mockReturnValue("tok");
    vi.mocked(api).mockResolvedValue({ user });
    const store = makeStore();
    await store.dispatch(asyncLoadProfile());
    expect(store.getState().auth.profile).toEqual(user);
    expect(store.getState().auth.isProfile).toBe(true);
  });

  it("token tidak valid: token dihapus dan profil null", async () => {
    vi.mocked(getAccessToken).mockReturnValue("bad");
    vi.mocked(api).mockRejectedValue(new Error("401"));
    const store = makeStore();
    await store.dispatch(asyncLoadProfile());
    expect(removeAccessToken).toHaveBeenCalled();
    expect(store.getState().auth.profile).toBeNull();
  });

  it("isAuthLogout menghapus token dan profil", () => {
    const store = makeStore({ auth: { profile: user, isProfile: true } });
    store.dispatch(isAuthLogout());
    expect(removeAccessToken).toHaveBeenCalled();
    expect(store.getState().auth.profile).toBeNull();
  });
});
