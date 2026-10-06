import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import NavbarComponent from "./NavbarComponent";

const mockUseAppSelector = vi.fn();

vi.mock("@/hooks/redux", () => ({
  useAppSelector: (selector: unknown) => mockUseAppSelector(selector),
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

describe("NavbarComponent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("menampilkan nama user dan link profil", () => {
    mockUseAppSelector.mockReturnValue({
      name: "Karina Putri Sion",
      photo: "https://example.com/karina.jpg",
    });

    const onMenu = vi.fn();
    const onLogout = vi.fn();

    render(
      <NavbarComponent
        onMenu={onMenu}
        onLogout={onLogout}
      />
    );

    expect(
      screen.getByText("Karina Putri Sion")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "Profil Karina Putri Sion",
      })
    ).toHaveAttribute("href", "/profile");

    const image = document.querySelector("img");

    expect(image).toBeInTheDocument();

    expect(image).toHaveAttribute(
      "src",
      "https://example.com/karina.jpg"
    );

    expect(image).toHaveAttribute("alt", "");
  });

  it("menampilkan fallback ketika profile belum memiliki nama", () => {
    mockUseAppSelector.mockReturnValue({
      name: "",
      photo: "",
    });

    const onMenu = vi.fn();
    const onLogout = vi.fn();

    render(
      <NavbarComponent
        onMenu={onMenu}
        onLogout={onLogout}
      />
    );

    expect(
      screen.getByRole("link", {
        name: "Profil saya",
      })
    ).toHaveAttribute("href", "/profile");

    expect(
      screen.queryByText("Karina Putri Sion")
    ).not.toBeInTheDocument();
  });

  it("menggunakan avatar fallback jika user tidak memiliki foto", () => {
    mockUseAppSelector.mockReturnValue({
      name: "Karina Putri Sion",
      photo: "",
    });

    const onMenu = vi.fn();
    const onLogout = vi.fn();

    render(
      <NavbarComponent
        onMenu={onMenu}
        onLogout={onLogout}
      />
    );

    const image = document.querySelector("img");

    expect(image).toBeInTheDocument();

    expect(image).toHaveAttribute(
      "src",
      expect.stringContaining(
        "https://ui-avatars.com/api/"
      )
    );

    expect(image?.getAttribute("src")).toContain(
      "name=Karina%20Putri%20Sion"
    );
  });

  it("memanggil onMenu ketika tombol buka menu diklik", () => {
    mockUseAppSelector.mockReturnValue({
      name: "Karina Putri Sion",
      photo: "",
    });

    const onMenu = vi.fn();
    const onLogout = vi.fn();

    render(
      <NavbarComponent
        onMenu={onMenu}
        onLogout={onLogout}
      />
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Buka menu",
      })
    );

    expect(onMenu).toHaveBeenCalledTimes(1);
  });

  it("memanggil onLogout ketika tombol keluar diklik", () => {
    mockUseAppSelector.mockReturnValue({
      name: "Karina Putri Sion",
      photo: "",
    });

    const onMenu = vi.fn();
    const onLogout = vi.fn();

    render(
      <NavbarComponent
        onMenu={onMenu}
        onLogout={onLogout}
      />
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Keluar",
      })
    );

    expect(onLogout).toHaveBeenCalledTimes(1);
  });
});