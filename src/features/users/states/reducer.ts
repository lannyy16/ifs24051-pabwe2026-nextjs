import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getUsers } from "../api/userApi";
import type { User } from "@/types";
export const asyncLoadUsers = createAsyncThunk("users/load", (search?: string) => getUsers(search).then((d) => d.users));
export default createSlice({ name: "users", initialState: { users: [] as User[] }, reducers: {},
  extraReducers: (b) => { b.addCase(asyncLoadUsers.fulfilled, (s, a) => { s.users = a.payload; }); } }).reducer;
