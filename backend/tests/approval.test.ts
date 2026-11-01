import 'dotenv/config';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { Pool } from 'pg';
import { approvePendingMatch, ApprovalConflict } from '../src/services/approveMatch';

// Only runs when explicitly pointed at a test database; never uses application tables.
test('approval transaction regression tests', { skip: !process.env.TEST_DATABASE_URL }, async (t) => {
  const schema = `approval_test_${randomUUID().replace(/-/g, '')}`;
  const admin = new Pool({ connectionString: process.env.TEST_DATABASE_URL });
  const pool = new Pool({ connectionString: process.env.TEST_DATABASE_URL, options: `-c search_path=${schema}` });
  try {
    await admin.query(`CREATE SCHEMA "${schema}"`);
    await pool.query(`
      CREATE TABLE tutor (id varchar(7) PRIMARY KEY, priority boolean DEFAULT true);
      CREATE TABLE tutee (id integer PRIMARY KEY, priority boolean DEFAULT true);
      CREATE TABLE unmatched (id serial PRIMARY KEY, tutor_id varchar(7), tutee_id integer);
      CREATE TABLE matched (id serial PRIMARY KEY, tutor_id varchar(7), tutee_id integer);
      CREATE TABLE approved_matches (id serial PRIMARY KEY, tutor_id varchar(7), tutee_id integer,
        pair_date date NOT NULL, active boolean DEFAULT true);
    `);
    const input = { tutorId: 'abc1234', selectedTuteeId: 1, unmatchedTutorId: 1 };
    async function reset() {
      await pool.query(`TRUNCATE tutor, tutee, unmatched, matched, approved_matches RESTART IDENTITY;
        INSERT INTO tutor (id) VALUES ('abc1234'), ('def5678');
        INSERT INTO tutee (id) VALUES (1), (2);
        INSERT INTO unmatched (tutor_id) VALUES ('abc1234'), ('def5678');
        INSERT INTO unmatched (tutee_id) VALUES (1), (2);`);
    }
    async function counts() {
      const result = await pool.query(`SELECT
        (SELECT count(*)::int FROM approved_matches) AS pairs,
        (SELECT count(*)::int FROM matched) AS members,
        (SELECT count(*)::int FROM unmatched) AS pending`);
      return result.rows[0];
    }
    await t.test('sequential retries create one pairing and clear pending membership', async () => {
      await reset();
      await approvePendingMatch(pool, input);
      await approvePendingMatch(pool, input);
      assert.deepEqual(await counts(), { pairs: 1, members: 2, pending: 2 });
      assert.equal((await pool.query('SELECT priority FROM tutor WHERE id = $1', [input.tutorId])).rows[0].priority, false);
    });
    await t.test('ten simultaneous approvals create exactly one pairing', async () => {
      await reset();
      await Promise.all(Array.from({ length: 10 }, () => approvePendingMatch(pool, input)));
      assert.deepEqual(await counts(), { pairs: 1, members: 2, pending: 2 });
    });
    await t.test('two tutors cannot consume the same pending tutee', async () => {
      await reset();
      const results = await Promise.allSettled([
        approvePendingMatch(pool, input),
        approvePendingMatch(pool, { ...input, tutorId: 'def5678', unmatchedTutorId: 2 }),
      ]);
      assert.equal(results.filter((result) => result.status === 'fulfilled').length, 1);
      assert.deepEqual(await counts(), { pairs: 1, members: 2, pending: 2 });
    });
    await t.test('a stale tutor slot cannot be used for a different pairing', async () => {
      await reset();
      await approvePendingMatch(pool, input);
      await assert.rejects(approvePendingMatch(pool, { ...input, selectedTuteeId: 2 }), ApprovalConflict);
      assert.deepEqual(await counts(), { pairs: 1, members: 2, pending: 2 });
    });
    await t.test('database failure rolls back all side effects and allows retry', async () => {
      await reset();
      await pool.query('ALTER TABLE approved_matches ADD CONSTRAINT fail_insert CHECK (tutee_id <> 1)');
      try {
        await assert.rejects(approvePendingMatch(pool, input));
        assert.deepEqual(await counts(), { pairs: 0, members: 0, pending: 4 });
        assert.equal((await pool.query('SELECT priority FROM tutor WHERE id = $1', [input.tutorId])).rows[0].priority, true);
      } finally {
        await pool.query('ALTER TABLE approved_matches DROP CONSTRAINT fail_insert');
      }
      await approvePendingMatch(pool, input);
      assert.deepEqual(await counts(), { pairs: 1, members: 2, pending: 2 });
    });
    await t.test('a new pending slot can re-pair participants after unmatching', async () => {
      await reset();
      await approvePendingMatch(pool, input);
      await pool.query(`UPDATE approved_matches SET active = false;
        DELETE FROM matched;
        INSERT INTO unmatched (tutor_id) VALUES ('abc1234');
        INSERT INTO unmatched (tutee_id) VALUES (1)`);
      await approvePendingMatch(pool, { ...input, unmatchedTutorId: 5 });
      assert.equal((await pool.query('SELECT count(*)::int AS count FROM approved_matches WHERE active')).rows[0].count, 1);
    });
  } finally {
    await pool.end();
    await admin.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
    await admin.end();
  }
});
