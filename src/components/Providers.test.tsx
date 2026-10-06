import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Providers from "./Providers";

describe("Providers", () => {
  it("merender children di dalam Redux Provider", () => {
    render(
      <Providers>
        <div>Konten aplikasi</div>
      </Providers>
    );

    expect(screen.getByText("Konten aplikasi")).toBeInTheDocument();
  });
});