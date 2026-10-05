import { configureStore } from "@reduxjs/toolkit";
import auth from "@/features/auth/states/reducer";
import users from "@/features/users/states/reducer";
import posts from "@/features/posts/states/reducer";
export const store = configureStore({ reducer: { auth, users, posts } });
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
