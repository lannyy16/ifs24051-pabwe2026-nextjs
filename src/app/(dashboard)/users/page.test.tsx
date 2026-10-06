import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/users/pages/UsersPage", () => ({
  default: () => (
    <div data-testid="mock-users-page">
      Mock Users Page
    </div>
  ),
}));

import Page from "./page";

describe("Users App Page", () => {
  it("menampilkan UsersPage", () => {
    render(<Page />);

    expect(screen.getByTestId("mock-users-page")).toBeInTheDocument();
    expect(screen.getByText("Mock Users Page")).toBeInTheDocument();
  });
});