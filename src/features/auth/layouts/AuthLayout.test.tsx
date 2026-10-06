import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import AuthLayout from "./AuthLayout";

const mockReplace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

vi.mock("@/helpers/apiHelper", () => ({
  getAccessToken: vi.fn(),
}));

import { getAccessToken } from "@/helpers/apiHelper";

describe("AuthLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("menampilkan children ketika belum login", () => {
    vi.mocked(getAccessToken).mockReturnValue(null);

    render(
      <AuthLayout>
        <div>Halaman Login</div>
      </AuthLayout>
    );

    expect(screen.getByText("Halaman Login")).toBeInTheDocument();
    expect(
      screen.getByText((content) =>
        content.includes("Bagikan cerita")
      )
    ).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("redirect ke halaman utama jika sudah memiliki token", async () => {
    vi.mocked(getAccessToken).mockReturnValue("token-123");

    render(
      <AuthLayout>
        <div>Halaman Login</div>
      </AuthLayout>
    );

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/");
    });
  });
});