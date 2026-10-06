import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("../api/postApi", () => ({
  getPosts: vi.fn(),
  getPost: vi.fn(),
  addPost: vi.fn(),
  changePost: vi.fn(),
  changeCover: vi.fn(),
  deletePost: vi.fn(),
  toggleLike: vi.fn(),
  addComment: vi.fn(),
  deleteComment: vi.fn(),
}));

import * as postApi from "../api/postApi";
import {
  fetchPosts,
  fetchPost,
  addPost,
  changePost,
  uploadPostCover,
  deletePost,
  likePost,
  addComment,
  deleteComment,
} from "./action";

describe("posts action thunks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetchPosts menggunakan false sebagai default isMe", async () => {
    vi.mocked(postApi.getPosts).mockResolvedValue({
      posts: [],
    });

    const result = await fetchPosts()(vi.fn(), vi.fn(), undefined);

    expect(postApi.getPosts).toHaveBeenCalledWith(false);
    expect(result.type).toBe("posts/fetchPosts/fulfilled");
  });

  it("fetchPosts menggunakan nilai isMe yang diberikan", async () => {
    vi.mocked(postApi.getPosts).mockResolvedValue({
      posts: [],
    });

    const result = await fetchPosts(true)(vi.fn(), vi.fn(), undefined);

    expect(postApi.getPosts).toHaveBeenCalledWith(true);
    expect(result.type).toBe("posts/fetchPosts/fulfilled");
  });

  it("fetchPost memanggil getPost", async () => {
    vi.mocked(postApi.getPost).mockResolvedValue({
      id: "post-1",
    } as never);

    const result = await fetchPost("post-1")(vi.fn(), vi.fn(), undefined);

    expect(postApi.getPost).toHaveBeenCalledWith("post-1");
    expect(result.type).toBe("posts/fetchPost/fulfilled");
  });

  it("addPost menggunakan description yang diberikan", async () => {
    vi.mocked(postApi.addPost).mockResolvedValue(undefined);

    const result = await addPost("Halo dunia")(
      vi.fn(),
      vi.fn(),
      undefined
    );

    expect(postApi.addPost).toHaveBeenCalledWith("Halo dunia");
    expect(result.type).toBe("posts/addPost/fulfilled");
  });

  it("addPost menggunakan string kosong jika description tidak diberikan", async () => {
    vi.mocked(postApi.addPost).mockResolvedValue(undefined);

    const result = await addPost()(
      vi.fn(),
      vi.fn(),
      undefined
    );

    expect(postApi.addPost).toHaveBeenCalledWith("");
    expect(result.type).toBe("posts/addPost/fulfilled");
  });

  it("changePost memanggil API dengan id dan description", async () => {
    vi.mocked(postApi.changePost).mockResolvedValue({
      id: "post-1",
    } as never);

    const result = await changePost({
      id: "post-1",
      description: "Isi baru",
    })(vi.fn(), vi.fn(), undefined);

    expect(postApi.changePost).toHaveBeenCalledWith(
      "post-1",
      "Isi baru"
    );
    expect(result.type).toBe("posts/changePost/fulfilled");
  });

  it("uploadPostCover menggunakan cover", async () => {
    const file = new File(["cover"], "cover.jpg", {
      type: "image/jpeg",
    });

    vi.mocked(postApi.changeCover).mockResolvedValue({
      id: "post-1",
    } as never);

    const result = await uploadPostCover({
      id: "post-1",
      cover: file,
    })(vi.fn(), vi.fn(), undefined);

    expect(postApi.changeCover).toHaveBeenCalledWith(
      "post-1",
      file
    );
    expect(result.type).toBe("posts/uploadPostCover/fulfilled");
  });

  it("uploadPostCover menggunakan file jika cover tidak tersedia", async () => {
    const file = new File(["cover"], "cover.jpg", {
      type: "image/jpeg",
    });

    vi.mocked(postApi.changeCover).mockResolvedValue({
      id: "post-1",
    } as never);

    const result = await uploadPostCover({
      id: "post-1",
      file,
    })(vi.fn(), vi.fn(), undefined);

    expect(postApi.changeCover).toHaveBeenCalledWith(
      "post-1",
      file
    );
    expect(result.type).toBe("posts/uploadPostCover/fulfilled");
  });

  it("uploadPostCover gagal jika file tidak tersedia", async () => {
    const result = await uploadPostCover({
      id: "post-1",
    })(vi.fn(), vi.fn(), undefined);

    expect(result.type).toBe("posts/uploadPostCover/rejected");

    const rejectedResult = result as ReturnType<
      typeof uploadPostCover.rejected
    >;

    expect(rejectedResult.error.message).toBe(
      "File cover is required"
    );
  });

  it("deletePost memanggil API dan mengembalikan id", async () => {
    vi.mocked(postApi.deletePost).mockResolvedValue(undefined);

    const result = await deletePost("post-1")(
      vi.fn(),
      vi.fn(),
      undefined
    );

    expect(postApi.deletePost).toHaveBeenCalledWith("post-1");
    expect(result.type).toBe("posts/deletePost/fulfilled");
    expect(result.payload).toBe("post-1");
  });

  it("likePost memanggil toggleLike", async () => {
    vi.mocked(postApi.toggleLike).mockResolvedValue({
      id: "like-1",
    } as never);

    const result = await likePost("post-1")(
      vi.fn(),
      vi.fn(),
      undefined
    );

    expect(postApi.toggleLike).toHaveBeenCalledWith("post-1");
    expect(result.type).toBe("posts/likePost/fulfilled");
  });

  it("addComment memanggil API komentar", async () => {
    vi.mocked(postApi.addComment).mockResolvedValue({
      id: "comment-1",
    } as never);

    const result = await addComment({
      id: "post-1",
      comment: "Komentar",
    })(vi.fn(), vi.fn(), undefined);

    expect(postApi.addComment).toHaveBeenCalledWith(
      "post-1",
      "Komentar"
    );
    expect(result.type).toBe("posts/addComment/fulfilled");
  });

  it("deleteComment menggunakan postId", async () => {
    vi.mocked(postApi.deleteComment).mockResolvedValue(undefined);

    const result = await deleteComment({
      postId: "post-1",
      commentId: "comment-1",
    })(vi.fn(), vi.fn(), undefined);

    expect(postApi.deleteComment).toHaveBeenCalledWith(
      "post-1",
      "comment-1"
    );
    expect(result.type).toBe("posts/deleteComment/fulfilled");
    expect(result.payload).toBe("comment-1");
  });

  it("deleteComment menggunakan id jika postId tidak diberikan", async () => {
    vi.mocked(postApi.deleteComment).mockResolvedValue(undefined);

    const result = await deleteComment({
      id: "post-1",
      commentId: "comment-1",
    })(vi.fn(), vi.fn(), undefined);

    expect(postApi.deleteComment).toHaveBeenCalledWith(
      "post-1",
      "comment-1"
    );
    expect(result.type).toBe("posts/deleteComment/fulfilled");
  });

  it("deleteComment gagal jika postId tidak ada", async () => {
    const result = await deleteComment({
      commentId: "comment-1",
    })(vi.fn(), vi.fn(), undefined);

    expect(result.type).toBe("posts/deleteComment/rejected");

    const rejectedResult = result as ReturnType<
      typeof deleteComment.rejected
    >;

    expect(rejectedResult.error.message).toBe(
      "postId and commentId are required"
    );
  });

  it("deleteComment gagal jika commentId tidak ada", async () => {
    const result = await deleteComment({
      postId: "post-1",
    })(vi.fn(), vi.fn(), undefined);

    expect(result.type).toBe("posts/deleteComment/rejected");

    const rejectedResult = result as ReturnType<
      typeof deleteComment.rejected
    >;

    expect(rejectedResult.error.message).toBe(
      "postId and commentId are required"
    );
  });
});