import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/posts/pages/HomePage", () => ({
  default: () => (
    <div data-testid="mock-home-page">
      Mock Home Page
    </div>
  ),
}));

import Page from "./page";

describe("Dashboard Page", () => {
  it("menampilkan HomePage", () => {
    render(<Page />);

    expect(screen.getByTestId("mock-home-page")).toBeInTheDocument();
    expect(screen.getByText("Mock Home Page")).toBeInTheDocument();
  });
});