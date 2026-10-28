import { beforeEach, describe, expect, it, vi } from "vitest";
import { api, configureApiClient } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
const ok = (data: unknown) => json({ success: true, data });
const unauthorized = () =>
  json({ success: false, error: { code: "UNAUTHORIZED", message: "Unauthorized" } }, 401);

const makeHooks = () => ({
  getAccessToken: vi.fn((): string | null => "token-1"),
  refreshAccessToken: vi.fn(async (): Promise<string | null> => null),
  onAuthFailure: vi.fn(),
});

let hooks = makeHooks();
let fetchMock = vi.fn();

const requestAt = (index: number) => {
  const [url, init] = fetchMock.mock.calls[index] as [string, RequestInit];
  return { url, init, headers: init.headers as Record<string, string> };
};

async function failure(promise: Promise<unknown>): Promise<ApiError> {
  const error = await promise.then(
    () => null,
    (e: unknown) => e,
  );
  expect(error).toBeInstanceOf(ApiError);
  return error as ApiError;
}

beforeEach(() => {
  hooks = makeHooks();
  configureApiClient(hooks);
  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
});

describe("responses", () => {
  it("unwraps the success envelope and sends credentials and the bearer token", async () => {
    fetchMock.mockResolvedValue(ok({ id: 1 }));

    await expect(api.get("/habits/1")).resolves.toEqual({ id: 1 });

    const { url, init, headers } = requestAt(0);
    expect(url).toBe("/api/habits/1");
    expect(init.credentials).toBe("include");
    expect(headers.Authorization).toBe("Bearer token-1");
  });

  it("resolves undefined for 204", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
    await expect(api.delete("/habits/1")).resolves.toBeUndefined();
  });

  it("throws an ApiError from the error envelope", async () => {
    fetchMock.mockResolvedValue(
      json(
        {
          success: false,
          error: { code: "VALIDATION_ERROR", message: "Validation failed", details: ["name is empty"] },
          path: "/habits",
          timestamp: "2026-10-28T00:00:00.000Z",
        },
        400,
      ),
    );

    const error = await failure(api.post("/habits", {}));

    expect(error.status).toBe(400);
    expect(error.code).toBe("VALIDATION_ERROR");
    expect(error.message).toBe("Validation failed");
    expect(error.details).toEqual(["name is empty"]);
  });

  it("maps a network failure to NETWORK_ERROR with status 0", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));

    const error = await failure(api.get("/habits"));

    expect(error.status).toBe(0);
    expect(error.code).toBe("NETWORK_ERROR");
  });

  it("maps a non-JSON error page (proxy 502) to UNKNOWN", async () => {
    fetchMock.mockResolvedValue(new Response("<html>Bad Gateway</html>", { status: 502 }));

    const error = await failure(api.get("/habits"));

    expect(error.status).toBe(502);
    expect(error.code).toBe("UNKNOWN");
  });
});

describe("requests", () => {
  it("skips undefined and null query values", async () => {
    fetchMock.mockResolvedValue(ok([]));

    await api.get("/habits", { page: 1, archived: true, q: undefined, status: null });

    expect(requestAt(0).url).toBe("/api/habits?page=1&archived=true");
  });

  it("sends a JSON body with a content type", async () => {
    fetchMock.mockResolvedValue(ok({}));

    await api.post("/habits", { name: "Run" });

    const { init, headers } = requestAt(0);
    expect(init.method).toBe("POST");
    expect(init.body).toBe('{"name":"Run"}');
    expect(headers["Content-Type"]).toBe("application/json");
  });

  it("omits Authorization when there is no token", async () => {
    hooks.getAccessToken.mockReturnValue(null);
    fetchMock.mockResolvedValue(ok({}));

    await api.get("/habits");

    expect(requestAt(0).headers.Authorization).toBeUndefined();
  });
});

describe("401 handling", () => {
  it("refreshes once and retries with the new token", async () => {
    fetchMock.mockResolvedValueOnce(unauthorized()).mockResolvedValueOnce(ok("done"));
    hooks.refreshAccessToken.mockResolvedValueOnce("fresh");

    await expect(api.get("/habits")).resolves.toBe("done");

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(requestAt(1).headers.Authorization).toBe("Bearer fresh");
    expect(hooks.onAuthFailure).not.toHaveBeenCalled();
  });

  it("does not loop when the retry is also 401", async () => {
    fetchMock.mockResolvedValueOnce(unauthorized()).mockResolvedValueOnce(unauthorized());
    hooks.refreshAccessToken.mockResolvedValueOnce("fresh");

    const error = await failure(api.get("/habits"));

    expect(error.status).toBe(401);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(hooks.refreshAccessToken).toHaveBeenCalledTimes(1);
  });

  it("signals auth failure when the refresh fails", async () => {
    fetchMock.mockResolvedValue(unauthorized());
    hooks.refreshAccessToken.mockResolvedValueOnce(null);

    const error = await failure(api.get("/habits"));

    expect(error.status).toBe(401);
    expect(hooks.onAuthFailure).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("never refreshes for skipAuth calls such as login", async () => {
    fetchMock.mockResolvedValue(unauthorized());

    const error = await failure(api.post("/auth/login", {}, { skipAuth: true }));

    expect(error.status).toBe(401);
    expect(hooks.refreshAccessToken).not.toHaveBeenCalled();
    expect(requestAt(0).headers.Authorization).toBeUndefined();
  });
});
