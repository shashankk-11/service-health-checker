import { describe, expect, it, mock } from "bun:test";

describe("Health Checker", () => {
  it("should return UP for successful response", async () => {
    // 🔥 mock axios success
    mock.module("axios", () => ({
      default: {
        get: async () => {
          // 🔥 simulate network delay
          await new Promise((resolve) => setTimeout(resolve, 10));
          return { status: 200 };
        },
      },
    }));

    // 🔥 import AFTER mock
    const { checkHealth } = await import("../src/checker/healthChecker");

    const result = await checkHealth("https://fake.com");

    expect(result.status).toBe("UP");
    expect(result.statusCode).toBe(200);
    expect(result.responseTime).toBeGreaterThan(0);
  });

  it("should return DOWN when request fails", async () => {
    // 🔥 mock axios failure
    mock.module("axios", () => ({
      default: {
        get: async () => {
          throw new Error("Network error");
        },
      },
    }));

    const { checkHealth } = await import("../src/checker/healthChecker");

    const result = await checkHealth("https://fail.com");

    expect(result.status).toBe("DOWN");
  });
});
