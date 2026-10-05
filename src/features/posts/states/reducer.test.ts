import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../api/postApi", () => ({ getPosts: vi.fn(), getPost: vi.fn() }));

import { makeStore } from "@/test-utils";
import type { Post } from "@/types";
import { getPost, getPosts } from "../api/postApi";
import reducer, { asyncLoadPost, asyncLoadPosts } from "./reducer";

const post = { id: "1", description: "isi" } as unknown as Post;
const initial = { posts: [], post: null, isPost: false };

describe("posts reducer", () => {
  beforeEach(() => {
    vi.mocked(getPosts).mockReset();
    vi.mocked(getPost).mockReset();
  });

  it("pending mengaktifkan isPost", () => {
    expect(reducer(initial, asyncLoadPosts.pending("r", false)).isPost).toBe(true);
  });
  it("fulfilled mengisi daftar dan mematikan isPost", () => {
    const s = reducer({ ...initial, isPost: true }, asyncLoadPosts.fulfilled([post], "r", false));
    expect(s.posts).toEqual([post]);
    expect(s.isPost).toBe(false);
  });
  it("rejected mematikan isPost", () => {
    expect(reducer({ ...initial, isPost: true }, asyncLoadPosts.rejected(new Error("x"), "r", false)).isPost).toBe(false);
  });
  it("asyncLoadPost.fulfilled mengisi post", () => {
    expect(reducer(initial, asyncLoadPost.fulfilled(post, "r", "1")).post).toEqual(post);
  });

  it("thunk asyncLoadPosts memanggil API dan mengisi store", async () => {
    vi.mocked(getPosts).mockResolvedValue({ posts: [post] });
    const store = makeStore();
    await store.dispatch(asyncLoadPosts(true));
    expect(getPosts).toHaveBeenCalledWith(true);
    expect(store.getState().posts.posts).toEqual([post]);
    expect(store.getState().posts.isPost).toBe(false);
  });
  it("thunk asyncLoadPost memanggil API dan mengisi store", async () => {
    vi.mocked(getPost).mockResolvedValue({ post });
    const store = makeStore();
    await store.dispatch(asyncLoadPost("1"));
    expect(getPost).toHaveBeenCalledWith("1");
    expect(store.getState().posts.post).toEqual(post);
  });
});
