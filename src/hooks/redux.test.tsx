import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "@/store";
import { useAppDispatch, useAppSelector } from "./redux";

const wrapper = ({ children }: { children: ReactNode }) => <Provider store={store}>{children}</Provider>;

describe("hooks redux", () => {
  it("useAppSelector membaca state dari store", () => {
    const { result } = renderHook(() => useAppSelector((s) => s.posts.isPost), { wrapper });
    expect(result.current).toBe(false);
  });
  it("useAppDispatch mengembalikan dispatch milik store", () => {
    const { result } = renderHook(() => useAppDispatch(), { wrapper });
    expect(typeof result.current).toBe("function");
  });
});
