import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { authApi } from "@/lib/api/endpoints/auth";
import { ApiError } from "@/lib/api/errors";
import { refreshAccessToken } from "@/lib/auth/refresh";
import { clearAccessToken, getAccessToken, setAccessToken } from "@/lib/auth/token-store";

vi.mock("@/lib/api/endpoints/auth", () => ({ authApi: { refresh: vi.fn() } }));

const refresh = vi.mocked(authApi.refresh);

const unauthorized = () =>
  new ApiError({ status: 401, code: "UNAUTHORIZED", message: "Unauthorized" });

beforeEach(() => {
  refresh.mockReset();
  clearAccessToken();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("refreshAccessToken", () => {
  it("shares one request between concurrent callers", async () => {
    refresh.mockResolvedValue({ accessToken: "one" } as never);

    const [a, b] = await Promise.all([refreshAccessToken(), refreshAccessToken()]);

    expect(a).toBe("one");
    expect(b).toBe("one");
    expect(refresh).toHaveBeenCalledTimes(1);
    expect(getAccessToken()).toBe("one");
  });

  it("starts a new request once the previous one has finished", async () => {
    refresh.mockResolvedValue({ accessToken: "one" } as never);

    await refreshAccessToken();
    await refreshAccessToken();

    expect(refresh).toHaveBeenCalledTimes(2);
  });

  it("retries once after a 401, in case another tab rotated the cookie", async () => {
    vi.useFakeTimers();
    refresh
      .mockRejectedValueOnce(unauthorized())
      .mockResolvedValueOnce({ accessToken: "fresh" } as never);

    const pending = refreshAccessToken();
    await vi.advanceTimersByTimeAsync(300);

    await expect(pending).resolves.toBe("fresh");
    expect(refresh).toHaveBeenCalledTimes(2);
    expect(getAccessToken()).toBe("fresh");
  });

  it("returns null and clears the token after two 401s", async () => {
    vi.useFakeTimers();
    setAccessToken("stale");
    refresh.mockRejectedValue(unauthorized());

    const pending = refreshAccessToken();
    await vi.advanceTimersByTimeAsync(300);

    await expect(pending).resolves.toBeNull();
    expect(refresh).toHaveBeenCalledTimes(2);
    expect(getAccessToken()).toBeNull();
  });

  it("rethrows network errors without retrying or logging the user out", async () => {
    setAccessToken("old");
    refresh.mockRejectedValue(
      new ApiError({ status: 0, code: "NETWORK_ERROR", message: "offline" }),
    );

    await expect(refreshAccessToken()).rejects.toMatchObject({ code: "NETWORK_ERROR" });

    expect(refresh).toHaveBeenCalledTimes(1);
    expect(getAccessToken()).toBe("old");
  });
});
