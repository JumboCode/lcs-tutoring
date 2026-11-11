/***********************************************
 * Tests for approving a match. The database driver is fully mocked and fetch throws,
 * so nothing here can reach a real database.
 ***********************************************/

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PgDialect } from "drizzle-orm/pg-core";
import { Request, Response } from "express";

const mockDb = vi.hoisted(() => {
  // Must be set before the controller is imported, in case the mocks below ever fail
  process.env.DATABASE_URL = "postgres://test:test@localhost:1/not-a-real-db";

  return {
    approved: [] as { tutee_id: number; tutor_id: string }[],
    openSlots: [] as number[],
    batchCalls: 0,
    failBatch: false,
    lastBatch: [] as any[],
    select: () => ({
      from: (table: unknown) => ({
        where: async (condition: unknown) => mockDb.rowsFor(table, condition),
      }),
    }),
    rowsFor: (_table: unknown, _condition: unknown): unknown[] => [],
    insert: (table: unknown) => ({
      values: (values: object) => ({ kind: "insert", table, values }),
    }),
    update: (table: unknown) => ({
      set: () => ({ where: () => ({ kind: "update", table }) }),
    }),
    delete: (table: unknown) => ({
      where: (condition: unknown) => ({ kind: "delete", table, condition }),
    }),
    // Applies the writes that later calls read, so a repeat approval sees the first one
    batch: async (operations: any[]) => {
      mockDb.batchCalls += 1;
      mockDb.lastBatch = operations;
      if (mockDb.failBatch) throw new Error("database write failed");
      for (const op of operations) {
        if (op.kind === "insert" && op.values.pair_date) mockDb.approved.push(op.values);
        if (op.kind === "delete") mockDb.applyDelete(op.condition);
      }
    },
    applyDelete: (_condition: unknown) => {},
  };
});

vi.mock("dotenv/config", () => ({}));
vi.mock("drizzle-orm/neon-http", () => ({ drizzle: () => mockDb }));
vi.mock("../algorithm.js", () => ({ default: class {} }));

import { approveMatch } from "./matchSuggestionsController";
import { unmatchedTable } from "../db/schema";

const toQuery = (condition: any) => new PgDialect().sqlToQuery(condition);

// Slot lookups filter on the row id in the query, approved match lookups return every approved row
mockDb.rowsFor = (table, condition) =>
  table === unmatchedTable
    ? mockDb.openSlots.filter((id) => id === toQuery(condition).params[0]).map((id) => ({ id }))
    : mockDb.approved;

mockDb.applyDelete = (condition) => {
  const { sql, params } = toQuery(condition);
  if (sql.includes('"id"')) mockDb.openSlots = mockDb.openSlots.filter((id) => id !== params[0]);
};

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
    mockDb.approved = [];
    mockDb.openSlots = [99, 100];
    mockDb.batchCalls = 0;
    mockDb.failBatch = false;
    mockDb.lastBatch = [];
    fetchSpy.mockClear();
    vi.stubGlobal("fetch", fetchSpy);
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    expect(fetchSpy).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("removes the pairing and creates exactly one approved match", async () => {
    const result = await approve(pair);

    expect(result.status).toBe(200);
    expect(mockDb.approved).toHaveLength(1);
    expect(mockDb.approved[0]).toMatchObject({ tutee_id: 5, tutor_id: "1234567" });

    // The tutee and this one tutor slot leave the available list
    const deletes = mockDb.lastBatch
      .filter((op) => op.kind === "delete" && op.table === unmatchedTable)
      .map((op) => toQuery(op.condition));
    expect(deletes).toHaveLength(2);
    expect(deletes[0].sql).toContain('"id"');
    expect(deletes[0].params).toEqual([99]);
    expect(deletes[1].sql).toContain('"tutee_id"');
    expect(deletes[1].params).toEqual([5]);
  });

  it("keeps a tutor's other open slots so they can take another tutee", async () => {
    await approve(pair);

    expect(mockDb.openSlots).toEqual([100]);
  });

  it("does not create a duplicate when the same pair is approved twice", async () => {
    await approve(pair);
    const second = await approve(pair);

    expect(second.status).toBe(409);
    expect(second.body.error).toBeTruthy();
    expect(mockDb.approved).toHaveLength(1);
    expect(mockDb.batchCalls).toBe(1);
  });

  it("rejects a stale tutor slot without writing", async () => {
    const result = await approve({ ...pair, unmatchedTutorId: 12345 });

    expect(result.status).toBe(409);
    expect(mockDb.batchCalls).toBe(0);
  });

  it("returns an error when the writes fail", async () => {
    mockDb.failBatch = true;
    const result = await approve(pair);

    expect(result.status).toBe(500);
    expect(result.body.error).toBe("database write failed");
    expect(mockDb.approved).toHaveLength(0);
  });

  it("rejects invalid input without writing", async () => {
    const result = await approve({ ...pair, selectedTuteeId: null });

    expect(result.status).toBe(400);
    expect(mockDb.batchCalls).toBe(0);
  });
});
