import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/posts/pages/DetailPage", () => ({
  default: () => (
    <div data-testid="mock-detail-page">
      Mock Detail Page
    </div>
  ),
}));

import Page from "./page";

describe("Post Detail App Page", () => {
  it("menampilkan DetailPage", () => {
    render(<Page />);

    expect(screen.getByTestId("mock-detail-page")).toBeInTheDocument();
    expect(screen.getByText("Mock Detail Page")).toBeInTheDocument();
  });
});