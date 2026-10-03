import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getPost, getPosts } from "../api/postApi";
import type { Post } from "@/types";
export const asyncLoadPosts = createAsyncThunk("posts/load", (isMe: boolean) => getPosts(isMe).then((d) => d.posts));
export const asyncLoadPost = createAsyncThunk("posts/loadOne", (id: string) => getPost(id).then((d) => d.post));
export default createSlice({ name: "posts", initialState: { posts: [] as Post[], post: null as Post | null, isPost: false }, reducers: {},
  extraReducers: (b) => {
    b.addCase(asyncLoadPosts.pending, (s) => { s.isPost = true; });
    b.addCase(asyncLoadPosts.fulfilled, (s, a) => { s.posts = a.payload; s.isPost = false; });
    b.addCase(asyncLoadPosts.rejected, (s) => { s.isPost = false; });
    b.addCase(asyncLoadPost.fulfilled, (s, a) => { s.post = a.payload; });
  } }).reducer;
