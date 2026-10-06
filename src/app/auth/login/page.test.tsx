import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/auth/pages/LoginPage", () => ({
  default: () => (
    <div data-testid="mock-login-page">
      Mock Login Page
    </div>
  ),
}));

import Page from "./page";

describe("Login App Page", () => {
  it("menampilkan LoginPage", () => {
    render(<Page />);

    expect(screen.getByTestId("mock-login-page")).toBeInTheDocument();
    expect(screen.getByText("Mock Login Page")).toBeInTheDocument();
  });
});