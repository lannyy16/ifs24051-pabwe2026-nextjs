import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Modal from "./Modal";

describe("Modal", () => {
  it("menampilkan title dan children", () => {
    const onClose = vi.fn();

    render(
      <Modal
        title="Tambah Postingan"
        onClose={onClose}
      >
        <p>Isi modal</p>
      </Modal>
    );

    expect(
      screen.getByRole("heading", {
        name: "Tambah Postingan",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText("Isi modal")
    ).toBeInTheDocument();
  });

  it("memanggil onClose ketika area luar modal diklik", () => {
    const onClose = vi.fn();

    render(
      <Modal
        title="Tambah Postingan"
        onClose={onClose}
      >
        <p>Isi modal</p>
      </Modal>
    );

    const overlay = screen.getByRole("heading", {
      name: "Tambah Postingan",
    }).parentElement?.parentElement;

    expect(overlay).toBeInTheDocument();

    fireEvent.click(overlay!);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("tidak memanggil onClose ketika isi modal diklik", () => {
    const onClose = vi.fn();

    render(
      <Modal
        title="Tambah Postingan"
        onClose={onClose}
      >
        <button>Isi Modal</button>
      </Modal>
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Isi Modal",
      })
    );

    expect(onClose).not.toHaveBeenCalled();
  });

  it("menggunakan class overlay modal yang benar", () => {
    const onClose = vi.fn();

    render(
      <Modal
        title="Test Modal"
        onClose={onClose}
      >
        <p>Konten</p>
      </Modal>
    );

    const heading = screen.getByRole("heading", {
      name: "Test Modal",
    });

    const overlay = heading.parentElement?.parentElement;

    expect(overlay).toHaveClass(
      "fixed",
      "inset-0",
      "z-50",
      "grid",
      "place-items-center",
      "bg-black/40",
      "p-4"
    );
  });

  it("menggunakan class card pada isi modal", () => {
    const onClose = vi.fn();

    render(
      <Modal
        title="Test Modal"
        onClose={onClose}
      >
        <p>Konten</p>
      </Modal>
    );

    const heading = screen.getByRole("heading", {
      name: "Test Modal",
    });

    const content = heading.parentElement;

    expect(content).toHaveClass(
      "card",
      "w-full",
      "max-w-lg",
      "space-y-4",
      "p-6"
    );
  });
});