// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createMemoryRouter, RouterProvider } from "react-router";
import { ToastProvider } from "../src/components/ui/Toast";
import { Markdown } from "../src/components/ui/Markdown";
import { routes } from "../src/router";

function mockApi(map: Record<string, unknown>) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string) => {
      const path = String(url).replace("/api/public", "");
      const key = Object.keys(map).find((k) => path === k || path.startsWith(k + "?"));
      if (!key) return new Response(JSON.stringify({ error: { message: "nf" } }), { status: 404 });
      return new Response(JSON.stringify(map[key]), { status: 200 });
    }),
  );
}

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  return render(
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>,
  );
}

afterEach(() => vi.unstubAllGlobals());

const emptyHome = { latestArticles: [], latestNews: [], programs: [], featuredFacilities: [], emergencyHotlines: [], counts: { articles: 0, facilities: 0, programs: 0 } };

describe("public portal", () => {
  it("renders the home page with honest empty states", async () => {
    mockApi({ "/home": emptyHome });
    renderAt("/");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Informasi kesehatan tepercaya");
    expect(await screen.findByText("Belum ada artikel yang diterbitkan")).toBeInTheDocument();
    expect(screen.getByText("Direktori sedang disusun")).toBeInTheDocument();
  });

  it("shows an error state with retry when the API fails", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}", { status: 500 })));
    renderAt("/");
    expect(await screen.findByText("Gagal memuat data")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Coba lagi" })).toBeInTheDocument();
  });

  it("marks sample facilities and their verification status", async () => {
    mockApi({
      "/facility-filters": { types: [{ slug: "klinik", name: "Klinik" }], regions: [] },
      "/facilities": [
        {
          slug: "x",
          name: "[CONTOH] Klinik X",
          type: { slug: "klinik", name: "Klinik" },
          region: null,
          address: null,
          latitude: null,
          longitude: null,
          photoUrl: null,
          verificationStatus: "unverified",
          isSample: true,
        },
      ],
    });
    renderAt("/fasilitas");
    expect(await screen.findByText("[CONTOH] Klinik X")).toBeInTheDocument();
    expect(screen.getByText("Data contoh")).toBeInTheDocument();
    expect(screen.getByText("Belum diverifikasi")).toBeInTheDocument();
  });

  it("renders the not-found page for unknown routes", async () => {
    mockApi({});
    renderAt("/tidak-ada");
    expect(await screen.findByText("Halaman tidak ditemukan")).toBeInTheDocument();
  });

  it("shows the admin area as not yet available (no fake login form)", () => {
    mockApi({});
    renderAt("/admin/login");
    expect(screen.getByText("Login pengelola belum diaktifkan.")).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).toBeNull();
  });
});

describe("Markdown", () => {
  it("does not render HTML from content", () => {
    const { container } = render(<Markdown source={'<img src=x onerror="alert(1)">'} />);
    expect(container.querySelector("img")).toBeNull();
    expect(container.textContent).toContain("<img");
  });
});
