import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

const dispatchMock = vi.fn();

let profileState: {
  id: string;
  name: string;
  email: string;
  photo: string;
} | null = {
  id: "user-1",
  name: "Karina",
  email: "karina@example.com",
  photo: "",
};

vi.mock("@/hooks/redux", () => ({
  useAppDispatch: () => dispatchMock,
  useAppSelector: (selector: (state: unknown) => unknown) =>
    selector({
      auth: {
        profile: profileState,
      },
    }),
}));

vi.mock("@/features/auth/states/reducer", () => ({
  asyncLoadProfile: vi.fn(() => ({
    type: "auth/loadProfile",
  })),
}));

vi.mock("../api/userApi", () => ({
  changePassword: vi.fn(),
  updateMe: vi.fn(),
  uploadPhoto: vi.fn(),
}));

vi.mock("@/helpers/toolsHelper", () => ({
  showErrorDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
}));

import ProfilePage from "./ProfilePage";

import {
  changePassword,
  updateMe,
  uploadPhoto,
} from "../api/userApi";

import {
  showErrorDialog,
  showSuccessDialog,
} from "@/helpers/toolsHelper";

describe("ProfilePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    profileState = {
      id: "user-1",
      name: "Karina",
      email: "karina@example.com",
      photo: "",
    };

    dispatchMock.mockResolvedValue({
      type: "auth/loadProfile/fulfilled",
    });

    vi.mocked(updateMe).mockResolvedValue(undefined);
    vi.mocked(uploadPhoto).mockResolvedValue(undefined);
    vi.mocked(changePassword).mockResolvedValue(undefined);
  });

  it("menampilkan halaman profil", () => {
    render(<ProfilePage />);

    expect(
      screen.getByRole("heading", { name: "Profil Saya" })
    ).toBeInTheDocument();

    expect(
      screen.getByDisplayValue("Karina")
    ).toBeInTheDocument();

    expect(
      screen.getByDisplayValue("karina@example.com")
    ).toBeInTheDocument();
  });

  it("mengubah nama dan email", () => {
    render(<ProfilePage />);

    const name = screen.getByLabelText("Nama");
    const email = screen.getByLabelText("Email");

    fireEvent.change(name, {
      target: { value: "Karina Baru" },
    });

    fireEvent.change(email, {
      target: { value: "baru@example.com" },
    });

    expect(name).toHaveValue("Karina Baru");
    expect(email).toHaveValue("baru@example.com");
  });

  it("berhasil memperbarui profil", async () => {
    render(<ProfilePage />);

    fireEvent.submit(
      screen
        .getByRole("button", { name: "Simpan" })
        .closest("form")!
    );

    await waitFor(() => {
      expect(updateMe).toHaveBeenCalledWith(
        "Karina",
        "karina@example.com"
      );
    });

    expect(dispatchMock).toHaveBeenCalled();

    expect(showSuccessDialog).toHaveBeenCalledWith(
      "Profil diperbarui"
    );
  });

  it("menampilkan error ketika update profil gagal", async () => {
    vi.mocked(updateMe).mockRejectedValueOnce(
      new Error("Gagal update")
    );

    render(<ProfilePage />);

    fireEvent.submit(
      screen
        .getByRole("button", { name: "Simpan" })
        .closest("form")!
    );

    await waitFor(() => {
      expect(showErrorDialog).toHaveBeenCalledWith(
        "Gagal update"
      );
    });
  });

  it("berhasil mengganti foto", async () => {
    render(<ProfilePage />);

    const file = new File(
      ["photo"],
      "photo.jpg",
      {
        type: "image/jpeg",
      }
    );

    fireEvent.change(
      screen.getByLabelText("Ganti foto"),
      {
        target: {
          files: [file],
        },
      }
    );

    await waitFor(() => {
      expect(uploadPhoto).toHaveBeenCalledWith(file);
    });

    expect(showSuccessDialog).toHaveBeenCalledWith(
      "Foto diperbarui"
    );
  });

  it("tidak mengunggah foto jika file tidak dipilih", () => {
    render(<ProfilePage />);

    const input = screen.getByLabelText("Ganti foto");

    fireEvent.change(input, {
      target: {
        files: [],
      },
    });

    expect(uploadPhoto).not.toHaveBeenCalled();
  });

  it("berhasil mengganti kata sandi", async () => {
    render(<ProfilePage />);

    fireEvent.change(
      screen.getByLabelText("Kata sandi lama"),
      {
        target: {
          value: "lama123",
        },
      }
    );

    fireEvent.change(
      screen.getByLabelText("Kata sandi baru"),
      {
        target: {
          value: "baru123",
        },
      }
    );

    fireEvent.submit(
      screen
        .getByRole("button", { name: "Ubah" })
        .closest("form")!
    );

    await waitFor(() => {
      expect(changePassword).toHaveBeenCalledWith(
        "lama123",
        "baru123"
      );
    });

    expect(
      showSuccessDialog
    ).toHaveBeenCalledWith(
      "Kata sandi diubah"
    );

    expect(
      screen.getByLabelText("Kata sandi lama")
    ).toHaveValue("");

    expect(
      screen.getByLabelText("Kata sandi baru")
    ).toHaveValue("");
  });

  it("menampilkan error ketika mengganti kata sandi gagal", async () => {
    vi.mocked(changePassword).mockRejectedValueOnce(
      new Error("Password salah")
    );

    render(<ProfilePage />);

    fireEvent.change(
      screen.getByLabelText("Kata sandi lama"),
      {
        target: {
          value: "lama123",
        },
      }
    );

    fireEvent.change(
      screen.getByLabelText("Kata sandi baru"),
      {
        target: {
          value: "baru123",
        },
      }
    );

    fireEvent.submit(
      screen
        .getByRole("button", { name: "Ubah" })
        .closest("form")!
    );

    await waitFor(() => {
      expect(showErrorDialog).toHaveBeenCalledWith(
        "Password salah"
      );
    });
  });

  it("tidak menampilkan apa pun ketika profile belum tersedia", () => {
    profileState = null;

    const { container } = render(<ProfilePage />);

    expect(container.firstChild).toBeNull();
  });
});