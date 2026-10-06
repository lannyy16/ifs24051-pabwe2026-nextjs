import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import LoginPage from "./LoginPage";

const mockReplace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("../api/authApi", () => ({
  login: vi.fn(),
}));

vi.mock("@/helpers/apiHelper", () => ({
  putAccessToken: vi.fn(),
}));

vi.mock("@/helpers/toolsHelper", () => ({
  showErrorDialog: vi.fn(),
}));

import { login } from "../api/authApi";
import { putAccessToken } from "@/helpers/apiHelper";
import { showErrorDialog } from "@/helpers/toolsHelper";

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("menampilkan form login", () => {
    render(<LoginPage />);

    expect(
      screen.getByRole("heading", {
        name: /Selamat datang/,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText("Masuk untuk melanjutkan")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Email")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Kata sandi")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Masuk",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "Daftar",
      })
    ).toHaveAttribute("href", "/auth/register");
  });

  it("memperbarui input email dan password", () => {
    render(<LoginPage />);

    const email = screen.getByLabelText("Email");
    const password = screen.getByLabelText("Kata sandi");

    fireEvent.change(email, {
      target: {
        value: "karina@example.com",
      },
    });

    fireEvent.change(password, {
      target: {
        value: "password123",
      },
    });

    expect(email).toHaveValue("karina@example.com");
    expect(password).toHaveValue("password123");
  });

  it("berhasil login dan redirect ke halaman utama", async () => {
    vi.mocked(login).mockResolvedValue({
      token: "token-123",
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: {
        value: "karina@example.com",
      },
    });

    fireEvent.change(screen.getByLabelText("Kata sandi"), {
      target: {
        value: "password123",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Masuk",
      })
    );

    expect(
      screen.getByRole("button", {
        name: "Memproses...",
      })
    ).toBeDisabled();

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith(
        "karina@example.com",
        "password123"
      );
    });

    expect(putAccessToken).toHaveBeenCalledWith(
      "token-123"
    );

    expect(mockReplace).toHaveBeenCalledWith("/");
  });

  it("menampilkan error ketika login gagal", async () => {
    vi.mocked(login).mockRejectedValue(
      new Error("Email atau password salah")
    );

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: {
        value: "karina@example.com",
      },
    });

    fireEvent.change(screen.getByLabelText("Kata sandi"), {
      target: {
        value: "password123",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Masuk",
      })
    );

    await waitFor(() => {
      expect(showErrorDialog).toHaveBeenCalledWith(
        "Email atau password salah"
      );
    });

    expect(mockReplace).not.toHaveBeenCalled();
  });
});