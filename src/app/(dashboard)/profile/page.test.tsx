import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/users/pages/ProfilePage", () => ({
  default: () => <div>Mock Profile Page</div>,
}));

import Page from "./page";

describe("Profile App Page", () => {
  it("menampilkan ProfilePage", () => {
    render(<Page />);

    expect(screen.getByText("Mock Profile Page")).toBeInTheDocument();
  });
});