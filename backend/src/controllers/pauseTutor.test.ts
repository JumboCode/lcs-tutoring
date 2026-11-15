/***********************************************
 * Tests for the pause/unpause request handlers. The pause service and database
 * drivers are mocked and fetch throws, so nothing here can reach a real database.
 * The service itself is covered by tests/pauseTutor.test.ts.
 ***********************************************/

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Request, Response } from "express";

const service = vi.hoisted(() => {
  // Must be set before the controller is imported, in case the mocks below ever fail
  process.env.DATABASE_URL = "postgres://test:test@localhost:1/not-a-real-db";

  class PauseConflict extends Error {}
  class TutorNotFound extends Error {}
  return {
    PauseConflict,
    TutorNotFound,
    pauseTutor: vi.fn(),
    unpauseTutor: vi.fn(),
    getTutorStatus: vi.fn(),
  };
});

vi.mock("dotenv/config", () => ({}));
vi.mock("drizzle-orm/neon-http", () => ({ drizzle: () => ({}) }));
vi.mock("pg", () => ({ Pool: class {} }));
vi.mock("../services/pauseTutor", () => service);

import {
  pauseTutor,
  unpauseTutor,
  unmatchedToMatched,
  unmatchedToHistory,
} from "./tutorController";

type Handler = (req: Request, res: Response) => Promise<void>;
const call = async (handler: Handler, id: string) => {
  const res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() };
  await handler({ params: { id } } as unknown as Request, res as unknown as Response);
  return { status: res.status.mock.calls[0]?.[0] ?? 200, body: res.json.mock.calls[0][0] };
};

describe("pause/unpause handlers", () => {
  const fetchSpy = vi.fn(() => {
    throw new Error("Tests must not use the network");
  });

  beforeEach(() => {
    service.pauseTutor.mockReset().mockResolvedValue(undefined);
    service.unpauseTutor.mockReset().mockResolvedValue(undefined);
    service.getTutorStatus.mockReset();
    fetchSpy.mockClear();
    vi.stubGlobal("fetch", fetchSpy);
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    expect(fetchSpy).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("pauses the tutor in the URL", async () => {
    const result = await call(pauseTutor, "1234567");

    expect(result).toEqual({ status: 200, body: { success: true, status: "paused" } });
    expect(service.pauseTutor.mock.calls[0][1]).toBe("1234567");
  });

  it("unpauses the tutor in the URL", async () => {
    const result = await call(unpauseTutor, "1234567");

    expect(result).toEqual({ status: 200, body: { success: true, status: "active" } });
    expect(service.unpauseTutor.mock.calls[0][1]).toBe("1234567");
  });

  it("returns 409 with the reason when the tutor has an active match", async () => {
    service.pauseTutor.mockRejectedValue(
      new service.PauseConflict("This tutor has an active match. Unmatch them before pausing.")
    );

    const result = await call(pauseTutor, "1234567");

    expect(result.status).toBe(409);
    expect(result.body.error).toBe("This tutor has an active match. Unmatch them before pausing.");
  });

  it("returns 404 for an unknown tutor", async () => {
    service.unpauseTutor.mockRejectedValue(new service.TutorNotFound("Tutor not found"));

    const result = await call(unpauseTutor, "zzz9999");

    expect(result.status).toBe(404);
  });

  it.each([["blank", "   "], ["too long", "12345678"]])(
    "rejects a %s tutor id without calling the service",
    async (_label, id) => {
      const result = await call(pauseTutor, id);

      expect(result.status).toBe(400);
      expect(service.pauseTutor).not.toHaveBeenCalled();
    }
  );

  it("returns 500 without exposing internal error details", async () => {
    service.pauseTutor.mockRejectedValue(new Error("connection string leaked here"));

    const result = await call(pauseTutor, "1234567");

    expect(result.status).toBe(500);
    expect(result.body.error).toBe("Failed to pause tutor");
  });

  describe("move-tutor-to-matched", () => {
    it("returns 409 for a paused tutor", async () => {
      service.getTutorStatus.mockResolvedValue("paused");

      const result = await call(unmatchedToMatched, "1234567");

      expect(result.status).toBe(409);
      expect(result.body.error).toBe(
        "This tutor is paused. Unpause them on the Tutor Database page before matching them."
      );
      expect(service.getTutorStatus.mock.calls[0][1]).toBe("1234567");
    });

    it("does not reject an active tutor", async () => {
      service.getTutorStatus.mockResolvedValue("active");
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() };

      await unmatchedToMatched(
        { params: { id: "1234567" } } as unknown as Request,
        res as unknown as Response
      );

      // the move itself is still a TODO stub, so nothing is sent yet
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it("returns 404 for an unknown tutor", async () => {
      service.getTutorStatus.mockResolvedValue(null);

      const result = await call(unmatchedToMatched, "zzz9999");

      expect(result.status).toBe(404);
    });

    it("rejects an invalid tutor id without looking it up", async () => {
      const result = await call(unmatchedToMatched, "12345678");

      expect(result.status).toBe(400);
      expect(service.getTutorStatus).not.toHaveBeenCalled();
    });
  });

  describe("move-tutor-to-history", () => {
    it("returns 409 for a paused tutor before touching any tables", async () => {
      service.getTutorStatus.mockResolvedValue("paused");

      // The drizzle mock is an empty object, so any table read or write here
      // would throw and turn into a 500. A 409 means nothing was touched.
      const result = await call(unmatchedToHistory, "1234567");

      expect(result.status).toBe(409);
      expect(result.body.error).toBe(
        "This tutor is paused. Unpause them on the Tutor Database page before deleting them."
      );
      expect(service.getTutorStatus.mock.calls[0][1]).toBe("1234567");
    });

    it("rejects an invalid tutor id without looking it up", async () => {
      const result = await call(unmatchedToHistory, "123");

      expect(result.status).toBe(400);
      expect(service.getTutorStatus).not.toHaveBeenCalled();
    });
  });
});
