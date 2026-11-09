import { useCallback, useEffect, useState } from "react";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`/api/public${path}`, { signal, headers: { Accept: "application/json" } });
  } catch (e) {
    if ((e as Error).name === "AbortError") throw e;
    throw new ApiError(0, "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.");
  }
  if (!res.ok) {
    let message = "Terjadi kesalahan saat memuat data.";
    try {
      const body = (await res.json()) as { error?: { message?: string } };
      if (body.error?.message) message = body.error.message;
    } catch {
      /* non-JSON error body */
    }
    throw new ApiError(res.status, message);
  }
  return (await res.json()) as T;
}

export type ApiState<T> =
  | { status: "loading"; data?: undefined; error?: undefined }
  | { status: "success"; data: T; error?: undefined }
  | { status: "error"; data?: undefined; error: ApiError };

/** Fetch `path` (relative to /api/public). Pass null to skip. */
export function useApi<T>(path: string | null): ApiState<T> & { reload: () => void } {
  const [state, setState] = useState<ApiState<T>>({ status: "loading" });
  const [nonce, setNonce] = useState(0);
  const reload = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    if (path === null) return;
    const ctrl = new AbortController();
    setState({ status: "loading" });
    apiGet<T>(path, ctrl.signal)
      .then((data) => setState({ status: "success", data }))
      .catch((e: unknown) => {
        if ((e as Error).name === "AbortError") return;
        setState({
          status: "error",
          error: e instanceof ApiError ? e : new ApiError(0, "Terjadi kesalahan saat memuat data."),
        });
      });
    return () => ctrl.abort();
  }, [path, nonce]);

  return { ...state, reload };
}

/** Build a query string, dropping empty values. */
export function qs(params: Record<string, string | number | undefined | null>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}
