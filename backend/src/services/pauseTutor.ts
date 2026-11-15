import { Pool } from "pg";

export class PauseConflict extends Error {}
export class TutorNotFound extends Error {}

// Pausing locks the tutor row first, the same as approvePendingMatch does, so
// a pause and an approval for the same tutor run one after the other. Each
// check runs after the lock is held, so it sees any approval that just committed.
export async function pauseTutor(pool: Pool, tutorId: string) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const tutor = await client.query(
      "SELECT status FROM tutor WHERE id = $1 FOR UPDATE",
      [tutorId],
    );
    if (!tutor.rowCount) {
      throw new TutorNotFound("Tutor not found");
    }
    if (tutor.rows[0].status === "paused") {
      await client.query("COMMIT");
      return;
    }

    const activeMatch = await client.query(
      "SELECT 1 FROM approved_matches WHERE tutor_id = $1 AND active = true LIMIT 1",
      [tutorId],
    );
    if (activeMatch.rowCount) {
      throw new PauseConflict("This tutor has an active match. Unmatch them before pausing.");
    }

    const openSpot = await client.query(
      "SELECT 1 FROM unmatched WHERE tutor_id = $1 LIMIT 1",
      [tutorId],
    );
    if (!openSpot.rowCount) {
      throw new PauseConflict("Only unmatched tutors can be paused.");
    }

    await client.query("UPDATE tutor SET status = 'paused' WHERE id = $1", [tutorId]);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

// Returns the tutor's status, or null if there is no such tutor.
export async function getTutorStatus(pool: Pool, tutorId: string) {
  const result = await pool.query("SELECT status FROM tutor WHERE id = $1", [tutorId]);
  return result.rowCount ? (result.rows[0].status as string) : null;
}

// Unpausing only flips the status back. The tutor's unmatched rows were kept
// while paused, so they show up as unmatched again right away.
export async function unpauseTutor(pool: Pool, tutorId: string) {
  const result = await pool.query(
    "UPDATE tutor SET status = 'active' WHERE id = $1 RETURNING id",
    [tutorId],
  );
  if (!result.rowCount) {
    throw new TutorNotFound("Tutor not found");
  }
}
