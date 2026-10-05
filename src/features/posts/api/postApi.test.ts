import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/helpers/apiHelper", () => ({ api: vi.fn().mockResolvedValue("ok") }));

import { api } from "@/helpers/apiHelper";
import { addComment, addPost, changeCover, changePost, deleteAllPosts, deleteComment, deletePost, getPost, getPosts, toggleLike } from "./postApi";

const mocked = vi.mocked(api);

describe("postApi", () => {
  beforeEach(() => mocked.mockClear());

  it("getPosts tanpa argumen tidak memakai is_me", async () => {
    await getPosts();
    expect(mocked).toHaveBeenCalledWith("/posts", { query: { is_me: undefined } });
  });
  it("getPosts(true) memakai is_me=1", async () => {
    await getPosts(true);
    expect(mocked).toHaveBeenCalledWith("/posts", { query: { is_me: 1 } });
  });
  it("getPost", async () => {
    await getPost("7");
    expect(mocked).toHaveBeenCalledWith("/posts/7");
  });
  it("addPost", async () => {
    await addPost("isi");
    expect(mocked).toHaveBeenCalledWith("/posts", { method: "POST", body: { description: "isi" } });
  });
  it("changePost", async () => {
    await changePost("7", "baru");
    expect(mocked).toHaveBeenCalledWith("/posts/7", { method: "PUT", body: { description: "baru" } });
  });
  it("changeCover mengirim FormData berisi file", async () => {
    const file = new File(["x"], "c.png", { type: "image/png" });
    await changeCover("7", file);
    const [path, opt] = mocked.mock.calls[0] as [string, { method: string; body: FormData }];
    expect(path).toBe("/posts/7/cover");
    expect(opt.method).toBe("POST");
    expect(opt.body).toBeInstanceOf(FormData);
    expect(opt.body.get("cover")).toBeInstanceOf(File);
  });
  it("deletePost", async () => {
    await deletePost("7");
    expect(mocked).toHaveBeenCalledWith("/posts/7", { method: "DELETE" });
  });
  it("toggleLike", async () => {
    await toggleLike("7");
    expect(mocked).toHaveBeenCalledWith("/posts/7/likes", { method: "POST" });
  });
  it("addComment", async () => {
    await addComment("7", "bagus");
    expect(mocked).toHaveBeenCalledWith("/posts/7/comments", { method: "POST", body: { comment: "bagus" } });
  });
  it("deleteComment", async () => {
    await deleteComment("7", "c1");
    expect(mocked).toHaveBeenCalledWith("/posts/7/comments", { method: "DELETE", body: { comment_id: "c1" } });
  });
  it("deleteAllPosts", async () => {
    await deleteAllPosts();
    expect(mocked).toHaveBeenCalledWith("/posts", { method: "DELETE" });
  });
});
