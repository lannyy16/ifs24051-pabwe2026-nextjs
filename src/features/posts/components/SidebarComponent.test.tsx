import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import SidebarComponent from "./SidebarComponent";

const mockUsePathname = vi.fn();
const mockUseSearchParams = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
  useSearchParams: () => mockUseSearchParams(),
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    onClick,
    className,
  }: {
    children: React.ReactNode;
    href: string;
    onClick?: () => void;
    className?: string;
  }) => (
    <a
      href={href}
      onClick={onClick}
      className={className}
    >
      {children}
    </a>
  ),
}));

describe("SidebarComponent", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUsePathname.mockReturnValue("/");
    mockUseSearchParams.mockReturnValue({
      get: () => null,
    });
  });

  it("menampilkan semua menu sidebar", () => {
    const onClose = vi.fn();

    render(
      <SidebarComponent
        open={false}
        onClose={onClose}
      />
    );

    expect(
      screen.getByRole("link", {
        name: "Semua Postingan",
      })
    ).toHaveAttribute("href", "/");

    expect(
      screen.getByRole("link", {
        name: "Postingan Saya",
      })
    ).toHaveAttribute("href", "/?me=1");

    expect(
      screen.getByRole("link", {
        name: "Daftar Pengguna",
      })
    ).toHaveAttribute("href", "/users");

    expect(
      screen.getByRole("link", {
        name: "Profil Saya",
      })
    ).toHaveAttribute("href", "/profile");
  });

  it("mengaktifkan menu Semua Postingan pada halaman utama", () => {
    const onClose = vi.fn();

    mockUsePathname.mockReturnValue("/");
    mockUseSearchParams.mockReturnValue({
      get: () => null,
    });

    render(
      <SidebarComponent
        open={false}
        onClose={onClose}
      />
    );

    const semuaPostingan = screen.getByRole("link", {
      name: "Semua Postingan",
    });

    expect(semuaPostingan.className).toContain(
      "bg-indigo-50"
    );

    expect(semuaPostingan.className).toContain(
      "text-indigo-700"
    );
  });

  it("mengaktifkan menu Postingan Saya ketika query me=1", () => {
    const onClose = vi.fn();

    mockUsePathname.mockReturnValue("/");
    mockUseSearchParams.mockReturnValue({
      get: (key: string) => (key === "me" ? "1" : null),
    });

    render(
      <SidebarComponent
        open={false}
        onClose={onClose}
      />
    );

    const postinganSaya = screen.getByRole("link", {
      name: "Postingan Saya",
    });

    expect(postinganSaya.className).toContain(
      "bg-indigo-50"
    );

    expect(postinganSaya.className).toContain(
      "text-indigo-700"
    );

    const semuaPostingan = screen.getByRole("link", {
      name: "Semua Postingan",
    });

    expect(semuaPostingan.className).not.toContain(
      "bg-indigo-50"
    );
  });

  it("mengaktifkan menu Daftar Pengguna pada halaman users", () => {
    const onClose = vi.fn();

    mockUsePathname.mockReturnValue("/users");
    mockUseSearchParams.mockReturnValue({
      get: () => null,
    });

    render(
      <SidebarComponent
        open={false}
        onClose={onClose}
      />
    );

    const daftarPengguna = screen.getByRole("link", {
      name: "Daftar Pengguna",
    });

    expect(daftarPengguna.className).toContain(
      "bg-indigo-50"
    );

    expect(daftarPengguna.className).toContain(
      "text-indigo-700"
    );
  });

  it("mengaktifkan menu Profil Saya pada halaman profile", () => {
    const onClose = vi.fn();

    mockUsePathname.mockReturnValue("/profile");
    mockUseSearchParams.mockReturnValue({
      get: () => null,
    });

    render(
      <SidebarComponent
        open={false}
        onClose={onClose}
      />
    );

    const profilSaya = screen.getByRole("link", {
      name: "Profil Saya",
    });

    expect(profilSaya.className).toContain(
      "bg-indigo-50"
    );

    expect(profilSaya.className).toContain(
      "text-indigo-700"
    );
  });

  it("menampilkan overlay ketika sidebar terbuka", () => {
    const onClose = vi.fn();

    render(
      <SidebarComponent
        open={true}
        onClose={onClose}
      />
    );

    const overlay = document.querySelector(
      ".fixed.inset-0.z-40"
    );

    expect(overlay).toBeInTheDocument();
  });

  it("tidak menampilkan overlay ketika sidebar tertutup", () => {
    const onClose = vi.fn();

    render(
      <SidebarComponent
        open={false}
        onClose={onClose}
      />
    );

    const overlay = document.querySelector(
      ".fixed.inset-0.z-40"
    );

    expect(overlay).not.toBeInTheDocument();
  });

  it("memanggil onClose ketika overlay diklik", () => {
    const onClose = vi.fn();

    render(
      <SidebarComponent
        open={true}
        onClose={onClose}
      />
    );

    const overlay = document.querySelector(
      ".fixed.inset-0.z-40"
    );

    expect(overlay).toBeInTheDocument();

    fireEvent.click(overlay!);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("memanggil onClose ketika menu diklik", () => {
    const onClose = vi.fn();

    render(
      <SidebarComponent
        open={true}
        onClose={onClose}
      />
    );

    fireEvent.click(
      screen.getByRole("link", {
        name: "Semua Postingan",
      })
    );

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("sidebar terbuka menggunakan translate-x-0", () => {
    const onClose = vi.fn();

    render(
      <SidebarComponent
        open={true}
        onClose={onClose}
      />
    );

    const sidebar = document.querySelector("aside");

    expect(sidebar).toBeInTheDocument();
    expect(sidebar?.className).toContain(
      "translate-x-0"
    );
    expect(sidebar?.className).not.toContain(
      "-translate-x-full"
    );
  });

  it("sidebar tertutup menggunakan -translate-x-full", () => {
    const onClose = vi.fn();

    render(
      <SidebarComponent
        open={false}
        onClose={onClose}
      />
    );

    const sidebar = document.querySelector("aside");

    expect(sidebar).toBeInTheDocument();
    expect(sidebar?.className).toContain(
      "-translate-x-full"
    );
  });
});