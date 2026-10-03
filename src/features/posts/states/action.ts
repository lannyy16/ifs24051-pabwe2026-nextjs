import { createAsyncThunk } from "@reduxjs/toolkit";
import * as postApi from "../api/postApi";

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (isMe?: boolean) => {
    return postApi.getPosts(isMe ?? false);
  }
);

export const fetchPost = createAsyncThunk(
  "posts/fetchPost",
  async (id: string) => {
    return postApi.getPost(id);
  }
);

export const addPost = createAsyncThunk<void, string | undefined>(
  "posts/addPost",
  async (description = "") => {
    await postApi.addPost(description);
  }
);

export const changePost = createAsyncThunk(
  "posts/changePost",
  async ({ id, description }: { id: string; description: string }) => {
    return postApi.changePost(id, description);
  }
);

export const uploadPostCover = createAsyncThunk(
  "posts/uploadPostCover",
  async (payload: { id: string; cover?: File; file?: File }) => {
    const coverFile = payload.cover || payload.file;
    if (!coverFile) throw new Error("File cover is required");

    return postApi.changeCover(payload.id, coverFile);
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (id: string) => {
    await postApi.deletePost(id);
    return id;
  }
);

export const likePost = createAsyncThunk(
  "posts/likePost",
  async (id: string) => {
    return postApi.toggleLike(id);
  }
);

export const addComment = createAsyncThunk(
  "posts/addComment",
  async ({ id, comment }: { id: string; comment: string }) => {
    return postApi.addComment(id, comment);
  }
);

export const deleteComment = createAsyncThunk(
  "posts/deleteComment",
  async (payload: { postId?: string; id?: string; commentId?: string }) => {
    const targetPostId = payload.postId || payload.id;
    const targetCommentId = payload.commentId;

    if (!targetPostId || !targetCommentId) {
      throw new Error("postId and commentId are required");
    }

    await postApi.deleteComment(targetPostId, targetCommentId);
    return targetCommentId;
  }
);