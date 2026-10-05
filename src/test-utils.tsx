import type { ReactElement, ReactNode } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import auth from "@/features/auth/states/reducer";
import users from "@/features/users/states/reducer";
import posts from "@/features/posts/states/reducer";
import type { RootState } from "@/store";

export const makeStore = (preloadedState?: Partial<RootState>) =>
  configureStore({ reducer: { auth, users, posts }, preloadedState: preloadedState as RootState | undefined });

type Options = Omit<RenderOptions, "wrapper"> & { preloadedState?: Partial<RootState>; store?: ReturnType<typeof makeStore> };

export function renderWithStore(ui: ReactElement, { preloadedState, store = makeStore(preloadedState), ...options }: Options = {}) {
  const Wrapper = ({ children }: { children: ReactNode }) => <Provider store={store}>{children}</Provider>;
  return { store, ...render(ui, { wrapper: Wrapper, ...options }) };
}
