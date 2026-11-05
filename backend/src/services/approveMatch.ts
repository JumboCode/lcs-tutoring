import { Pool } from "pg";

export class ApprovalConflict extends Error {}

export interface ApprovalInput {
  tutorId: string;
  selectedTuteeId: number;
  unmatchedTutorId: number;
}

// A transaction keeps the pairing, membership rows, and pending list consistent.
// Lock persistent participant rows so retries still serialize after pending rows disappear.
export async function approvePendingMatch(pool: Pool, input: ApprovalInput) {
  const { tutorId, selectedTuteeId, unmatchedTutorId } = input;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query('SELECT id FROM tutor WHERE id = $1 FOR UPDATE', [tutorId]);
    await client.query('SELECT id FROM tutee WHERE id = $1 FOR UPDATE', [selectedTuteeId]);

    const existing = await client.query(
      'SELECT id FROM approved_matches WHERE tutor_id = $1 AND tutee_id = $2 AND active = true',
      [tutorId, selectedTuteeId],
    );
    if (existing.rowCount) {
      await client.query("COMMIT");
      return;
    }

    const tutorSlot = await client.query(
      'SELECT id FROM unmatched WHERE id = $1 AND tutor_id = $2 FOR UPDATE',
      [unmatchedTutorId, tutorId],
    );
    const tuteeSlot = await client.query(
      'SELECT id FROM unmatched WHERE tutee_id = $1 FOR UPDATE', [selectedTuteeId],
    );
    if (!tutorSlot.rowCount || !tuteeSlot.rowCount) {
      throw new ApprovalConflict("This match is no longer pending. Refresh suggestions and try again.");
    }

    await client.query('INSERT INTO matched (tutee_id) VALUES ($1)', [selectedTuteeId]);
    await client.query('INSERT INTO matched (tutor_id) VALUES ($1)', [tutorId]);
    await client.query(
      `INSERT INTO approved_matches (tutee_id, tutor_id, pair_date)
       VALUES ($1, $2, (CURRENT_TIMESTAMP AT TIME ZONE 'America/New_York')::date)`,
      [selectedTuteeId, tutorId],
    );
    await client.query('UPDATE tutor SET priority = false WHERE id = $1', [tutorId]);
    await client.query('UPDATE tutee SET priority = false WHERE id = $1', [selectedTuteeId]);
    await client.query('DELETE FROM unmatched WHERE id = $1 OR tutee_id = $2', [unmatchedTutorId, selectedTuteeId]);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
