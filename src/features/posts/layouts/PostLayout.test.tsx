import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import PostLayout from "./PostLayout";

const mockReplace = vi.fn();
const mockDispatch = vi.fn();
const mockUseAppSelector = vi.fn();
const mockGetAccessToken = vi.fn();
const mockShowConfirmDialog = vi.fn();
const mockAsyncLoadProfile = vi.fn(() => "asyncLoadProfile-action");
const mockIsAuthLogout = vi.fn(() => "isAuthLogout-action");

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

vi.mock("@/hooks/redux", () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: unknown) => mockUseAppSelector(selector),
}));

vi.mock("@/helpers/apiHelper", () => ({
  getAccessToken: () => mockGetAccessToken(),
}));

vi.mock("@/features/auth/states/reducer", () => ({
  asyncLoadProfile: () => mockAsyncLoadProfile(),
  isAuthLogout: () => mockIsAuthLogout(),
}));

vi.mock("@/helpers/toolsHelper", () => ({
  showConfirmDialog: (message: string) =>
    mockShowConfirmDialog(message),
}));

vi.mock("../components/NavbarComponent", () => ({
  default: ({
    onMenu,
    onLogout,
  }: {
    onMenu: () => void;
    onLogout: () => void;
  }) => (
    <div>
      <button onClick={onMenu}>Buka Menu Navbar</button>
      <button onClick={onLogout}>Logout Navbar</button>
    </div>
  ),
}));

vi.mock("../components/SidebarComponent", () => ({
  default: ({
    open,
    onClose,
  }: {
    open: boolean;
    onClose: () => void;
  }) => (
    <div>
      <span data-testid="sidebar-status">
        {open ? "Sidebar Terbuka" : "Sidebar Tertutup"}
      </span>

      <button onClick={onClose}>
        Tutup Sidebar
      </button>
    </div>
  ),
}));

describe("PostLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockGetAccessToken.mockReturnValue("token-123");

    mockUseAppSelector.mockReturnValue({
      profile: {
        id: "user-1",
        name: "Karina Putri Sion",
      },
      isProfile: false,
    });

    mockShowConfirmDialog.mockResolvedValue(false);
  });

  it("redirect ke login jika tidak memiliki access token", async () => {
    mockGetAccessToken.mockReturnValue(null);

    render(
      <PostLayout>
        <div>Halaman Postingan</div>
      </PostLayout>
    );

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith(
        "/auth/login"
      );
    });

    expect(mockAsyncLoadProfile).not.toHaveBeenCalled();
  });

  it("memanggil asyncLoadProfile jika memiliki access token", async () => {
    mockGetAccessToken.mockReturnValue("token-123");

    render(
      <PostLayout>
        <div>Halaman Postingan</div>
      </PostLayout>
    );

    await waitFor(() => {
      expect(mockAsyncLoadProfile).toHaveBeenCalledTimes(1);
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      "asyncLoadProfile-action"
    );
  });

  it("menampilkan halaman Memuat jika profile belum tersedia", () => {
    mockUseAppSelector.mockReturnValue({
      profile: null,
      isProfile: false,
    });

    render(
      <PostLayout>
        <div>Halaman Postingan</div>
      </PostLayout>
    );

    expect(
      screen.getByText("Memuat...")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Memuat",
      })
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Halaman Postingan")
    ).not.toBeInTheDocument();
  });

  it("menampilkan children ketika profile tersedia", () => {
    render(
      <PostLayout>
        <div>Halaman Postingan</div>
      </PostLayout>
    );

    expect(
      screen.getByText("Halaman Postingan")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Buka Menu Navbar",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByTestId("sidebar-status")
    ).toHaveTextContent("Sidebar Tertutup");
  });

  it("redirect ke login jika profile gagal dimuat", async () => {
    mockUseAppSelector.mockReturnValue({
      profile: null,
      isProfile: true,
    });

    render(
      <PostLayout>
        <div>Halaman Postingan</div>
      </PostLayout>
    );

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith(
        "/auth/login"
      );
    });
  });

  it("tidak redirect ke login ketika profile tersedia", async () => {
    mockUseAppSelector.mockReturnValue({
      profile: {
        id: "user-1",
        name: "Karina Putri Sion",
      },
      isProfile: true,
    });

    render(
      <PostLayout>
        <div>Halaman Postingan</div>
      </PostLayout>
    );

    await waitFor(() => {
      expect(mockAsyncLoadProfile).toHaveBeenCalledTimes(1);
    });

    expect(mockReplace).not.toHaveBeenCalledWith(
      "/auth/login"
    );
  });

  it("membuka sidebar ketika tombol menu navbar diklik", () => {
    render(
      <PostLayout>
        <div>Halaman Postingan</div>
      </PostLayout>
    );

    expect(
      screen.getByTestId("sidebar-status")
    ).toHaveTextContent("Sidebar Tertutup");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Buka Menu Navbar",
      })
    );

    expect(
      screen.getByTestId("sidebar-status")
    ).toHaveTextContent("Sidebar Terbuka");
  });

  it("menutup sidebar ketika tombol tutup sidebar diklik", () => {
    render(
      <PostLayout>
        <div>Halaman Postingan</div>
      </PostLayout>
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Buka Menu Navbar",
      })
    );

    expect(
      screen.getByTestId("sidebar-status")
    ).toHaveTextContent("Sidebar Terbuka");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Tutup Sidebar",
      })
    );

    expect(
      screen.getByTestId("sidebar-status")
    ).toHaveTextContent("Sidebar Tertutup");
  });

  it("logout tidak dilakukan jika konfirmasi dibatalkan", async () => {
    mockShowConfirmDialog.mockResolvedValue(false);

    render(
      <PostLayout>
        <div>Halaman Postingan</div>
      </PostLayout>
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Logout Navbar",
      })
    );

    await waitFor(() => {
      expect(mockShowConfirmDialog).toHaveBeenCalledWith(
        "Keluar dari akun?"
      );
    });

    expect(mockIsAuthLogout).not.toHaveBeenCalled();

    expect(mockReplace).not.toHaveBeenCalledWith(
      "/auth/login"
    );
  });

  it("logout dilakukan jika konfirmasi disetujui", async () => {
    mockShowConfirmDialog.mockResolvedValue(true);

    render(
      <PostLayout>
        <div>Halaman Postingan</div>
      </PostLayout>
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Logout Navbar",
      })
    );

    await waitFor(() => {
      expect(mockShowConfirmDialog).toHaveBeenCalledWith(
        "Keluar dari akun?"
      );
    });

    await waitFor(() => {
      expect(mockIsAuthLogout).toHaveBeenCalledTimes(1);
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      "isAuthLogout-action"
    );

    expect(mockReplace).toHaveBeenCalledWith(
      "/auth/login"
    );
  });

  it("memanggil konfirmasi logout ketika tombol logout diklik", async () => {
    mockShowConfirmDialog.mockResolvedValue(false);

    render(
      <PostLayout>
        <div>Halaman Postingan</div>
      </PostLayout>
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Logout Navbar",
      })
    );

    await waitFor(() => {
      expect(mockShowConfirmDialog).toHaveBeenCalledTimes(1);
    });
  });
});