import { describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import type { ChangeEvent } from "react";
import useInput from "./useInput";

const evt = (value: string) => ({ target: { value } }) as ChangeEvent<HTMLInputElement>;

describe("useInput", () => {
  it("nilai awal default adalah string kosong", () => {
    const { result } = renderHook(() => useInput());
    expect(result.current[0]).toBe("");
  });
  it("memakai nilai awal yang diberikan", () => {
    const { result } = renderHook(() => useInput("halo"));
    expect(result.current[0]).toBe("halo");
  });
  it("memperbarui nilai lewat event onChange", () => {
    const { result } = renderHook(() => useInput());
    act(() => result.current[1](evt("baru")));
    expect(result.current[0]).toBe("baru");
  });
  it("memperbarui nilai lewat setter langsung", () => {
    const { result } = renderHook(() => useInput("a"));
    act(() => result.current[2]("b"));
    expect(result.current[0]).toBe("b");
  });
});
