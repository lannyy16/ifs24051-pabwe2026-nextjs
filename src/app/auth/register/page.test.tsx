import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/auth/pages/RegisterPage", () => ({
  default: () => <div>Mock Register Page</div>,
}));

import Page from "./page";

describe("Register App Page", () => {
  it("menampilkan RegisterPage", () => {
    render(<Page />);

    expect(screen.getByText("Mock Register Page")).toBeInTheDocument();
  });
});