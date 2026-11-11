/***********************************************
 * Tests for the approveMatch request handler. The approval service and database
 * drivers are mocked and fetch throws, so nothing here can reach a real database.
 * The transaction itself is covered by tests/approval.test.ts.
 ***********************************************/

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Request, Response } from "express";

const service = vi.hoisted(() => {
  // Must be set before the controller is imported, in case the mocks below ever fail
  process.env.DATABASE_URL = "postgres://test:test@localhost:1/not-a-real-db";

  class ApprovalConflict extends Error {}
  return { ApprovalConflict, approvePendingMatch: vi.fn() };
});

vi.mock("dotenv/config", () => ({}));
vi.mock("drizzle-orm/neon-http", () => ({ drizzle: () => ({}) }));
vi.mock("pg", () => ({ Pool: class {} }));
vi.mock("../algorithm.js", () => ({ default: class {} }));
vi.mock("../services/approveMatch", () => service);

import { approveMatch } from "./matchSuggestionsController";

const approve = async (body: object) => {
  const res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() };
  await approveMatch({ body } as Request, res as unknown as Response);
  return { status: res.status.mock.calls[0][0], body: res.json.mock.calls[0][0] };
};

const pair = { tutorId: "1234567", selectedTuteeId: 5, unmatchedTutorId: 99 };

describe("approveMatch", () => {
  const fetchSpy = vi.fn(() => {
    throw new Error("Tests must not use the network");
  });

  beforeEach(() => {
    service.approvePendingMatch.mockReset();
    service.approvePendingMatch.mockResolvedValue(undefined);
    fetchSpy.mockClear();
    vi.stubGlobal("fetch", fetchSpy);
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    expect(fetchSpy).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("approves a valid pair through the transactional service", async () => {
    const result = await approve(pair);

    expect(result.status).toBe(200);
    expect(result.body).toEqual({ success: true });
    expect(service.approvePendingMatch).toHaveBeenCalledTimes(1);
    expect(service.approvePendingMatch.mock.calls[0][1]).toEqual(pair);
  });

  it("converts numeric ids sent as strings before calling the service", async () => {
    await approve({ ...pair, selectedTuteeId: "5", unmatchedTutorId: "99" });

    expect(service.approvePendingMatch.mock.calls[0][1]).toEqual(pair);
  });

  it.each([
    ["a missing tutee", { ...pair, selectedTuteeId: null }],
    ["a non-numeric tutee id", { ...pair, selectedTuteeId: "abc" }],
    ["a missing tutor slot", { ...pair, unmatchedTutorId: undefined }],
    ["a tutor id that is not a string", { ...pair, tutorId: 1234567 }],
    ["a blank tutor id", { ...pair, tutorId: "   " }],
    ["a tutor id longer than 7 characters", { ...pair, tutorId: "12345678" }],
  ])("rejects %s without calling the service", async (_label, body) => {
    const result = await approve(body);

    expect(result.status).toBe(400);
    expect(service.approvePendingMatch).not.toHaveBeenCalled();
  });

  it("returns 409 with the conflict message when the match is no longer pending", async () => {
    service.approvePendingMatch.mockRejectedValue(
      new service.ApprovalConflict("This match is no longer pending. Refresh suggestions and try again.")
    );

    const result = await approve(pair);

    expect(result.status).toBe(409);
    expect(result.body.error).toBe("This match is no longer pending. Refresh suggestions and try again.");
  });

  it("returns 500 without exposing internal error details", async () => {
    service.approvePendingMatch.mockRejectedValue(new Error("connection string leaked here"));

    const result = await approve(pair);

    expect(result.status).toBe(500);
    expect(result.body.error).toBe("Failed to approve match");
  });
});
