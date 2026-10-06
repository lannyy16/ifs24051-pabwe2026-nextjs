import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

const mockDispatch = vi.fn();

vi.mock("@/hooks/redux", () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: (state: unknown) => unknown) =>
    selector({
      users: {
        users: [
          {
            id: "1",
            name: "Karina",
            email: "karina@example.com",
            photo: "",
          },
          {
            id: "2",
            name: "Niken",
            email: "niken@example.com",
            photo: "https://example.com/niken.jpg",
          },
        ],
      },
    }),
}));

vi.mock("../states/reducer", () => ({
  asyncLoadUsers: vi.fn((query?: string) => ({
    type: "users/loadUsers",
    payload: query,
  })),
}));

import UsersPage from "./UsersPage";
import { asyncLoadUsers } from "../states/reducer";

describe("UsersPage", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("menampilkan daftar pengguna", () => {
    render(<UsersPage />);

    expect(screen.getByRole("heading", { name: "Daftar Pengguna" }))
      .toBeInTheDocument();

    expect(screen.getByText("Karina")).toBeInTheDocument();
    expect(screen.getByText("karina@example.com")).toBeInTheDocument();

    expect(screen.getByText("Niken")).toBeInTheDocument();
    expect(screen.getByText("niken@example.com")).toBeInTheDocument();
  });

  it("menampilkan foto pengguna jika tersedia", () => {
    render(<UsersPage />);

    const images = document.querySelectorAll("img");

    expect(images).toHaveLength(2);

    expect(images[1]).toHaveAttribute(
      "src",
      "https://example.com/niken.jpg"
    );
  });

  it("menampilkan avatar fallback jika foto tidak tersedia", () => {
    render(<UsersPage />);

    const images = document.querySelectorAll("img");

    expect(images[0]).toHaveAttribute(
      "src",
      "https://ui-avatars.com/api/?background=6366f1&color=fff&name=Karina"
    );
  });

  it("memanggil asyncLoadUsers tanpa query setelah debounce", async () => {
    render(<UsersPage />);

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(asyncLoadUsers).toHaveBeenCalledWith(undefined);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it("memanggil asyncLoadUsers dengan query pencarian", async () => {
    render(<UsersPage />);

    const input = screen.getByRole("textbox", {
      name: "Cari pengguna",
    });

    fireEvent.change(input, {
      target: {
        value: "Niken",
      },
    });

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(asyncLoadUsers).toHaveBeenCalledWith("Niken");
    expect(mockDispatch).toHaveBeenCalled();
  });

  it("memperbarui nilai input pencarian", () => {
    render(<UsersPage />);

    const input = screen.getByRole("textbox", {
      name: "Cari pengguna",
    }) as HTMLInputElement;

    expect(input.value).toBe("");

    fireEvent.change(input, {
      target: {
        value: "Karina",
      },
    });

    expect(input.value).toBe("Karina");
  });
});