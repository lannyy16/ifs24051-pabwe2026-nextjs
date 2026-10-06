import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import RegisterPage from "./RegisterPage";

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
  register: vi.fn(),
}));

vi.mock("@/helpers/toolsHelper", () => ({
  showErrorDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
  showWarningDialog: vi.fn(),
}));

import { register } from "../api/authApi";
import {
  showErrorDialog,
  showSuccessDialog,
  showWarningDialog,
} from "@/helpers/toolsHelper";

describe("RegisterPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("menampilkan form register", () => {
    render(<RegisterPage />);

    expect(
      screen.getByRole("heading", { name: "Buat akun baru" })
    ).toBeInTheDocument();

    expect(
      screen.getByText("Hanya butuh semenit")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Nama lengkap")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Email")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Kata sandi")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Daftar" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: "Masuk" })
    ).toHaveAttribute("href", "/auth/login");
  });

  it("memperbarui semua input", () => {
    render(<RegisterPage />);

    const name = screen.getByLabelText("Nama lengkap");
    const email = screen.getByLabelText("Email");
    const password = screen.getByLabelText("Kata sandi");

    fireEvent.change(name, {
      target: {
        value: "Karina Putri Sion",
      },
    });

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

    expect(name).toHaveValue("Karina Putri Sion");
    expect(email).toHaveValue("karina@example.com");
    expect(password).toHaveValue("password123");
  });

  it("menampilkan warning jika password kurang dari 6 karakter", async () => {
    render(<RegisterPage />);

    fireEvent.change(screen.getByLabelText("Nama lengkap"), {
      target: {
        value: "Karina Putri Sion",
      },
    });

    fireEvent.change(screen.getByLabelText("Email"), {
      target: {
        value: "karina@example.com",
      },
    });

    fireEvent.change(screen.getByLabelText("Kata sandi"), {
      target: {
        value: "12345",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Daftar",
      })
    );

    await waitFor(() => {
      expect(showWarningDialog).toHaveBeenCalledWith(
        "Kata sandi minimal 6 karakter"
      );
    });

    expect(register).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("berhasil membuat akun dan redirect ke halaman login", async () => {
    vi.mocked(register).mockResolvedValue(undefined);
    vi.mocked(showSuccessDialog).mockResolvedValue(undefined);

    render(<RegisterPage />);

    fireEvent.change(screen.getByLabelText("Nama lengkap"), {
      target: {
        value: "Karina Putri Sion",
      },
    });

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
        name: "Daftar",
      })
    );

    expect(
      screen.getByRole("button", {
        name: "Memproses...",
      })
    ).toBeDisabled();

    await waitFor(() => {
      expect(register).toHaveBeenCalledWith(
        "Karina Putri Sion",
        "karina@example.com",
        "password123"
      );
    });

    expect(showSuccessDialog).toHaveBeenCalledWith(
      "Akun dibuat, silakan masuk"
    );

    expect(mockReplace).toHaveBeenCalledWith(
      "/auth/login"
    );
  });

  it("menampilkan error ketika register gagal", async () => {
    vi.mocked(register).mockRejectedValue(
      new Error("Email sudah digunakan")
    );

    render(<RegisterPage />);

    fireEvent.change(screen.getByLabelText("Nama lengkap"), {
      target: {
        value: "Karina Putri Sion",
      },
    });

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
        name: "Daftar",
      })
    );

    await waitFor(() => {
      expect(showErrorDialog).toHaveBeenCalledWith(
        "Email sudah digunakan"
      );
    });

    expect(mockReplace).not.toHaveBeenCalled();
  });
});