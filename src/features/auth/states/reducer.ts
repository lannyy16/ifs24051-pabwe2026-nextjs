import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, getAccessToken, removeAccessToken } from "@/helpers/apiHelper";
import type { User } from "@/types";
export const asyncLoadProfile = createAsyncThunk("auth/profile", async () => {
  if (!getAccessToken()) return null;
  try { return (await api<{ user: User }>("/users/me")).user; } catch { removeAccessToken(); return null; }
});
const slice = createSlice({
  name: "auth", initialState: { profile: null as User | null, isProfile: false },
  reducers: { isAuthLogout: (s) => { removeAccessToken(); s.profile = null; } },
  extraReducers: (b) => { b.addCase(asyncLoadProfile.fulfilled, (s, a) => { s.profile = a.payload; s.isProfile = true; }); },
});
export const { isAuthLogout } = slice.actions;
export default slice.reducer;
