import 'dotenv/config';
import { afterAll, beforeAll, describe, it } from 'vitest';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { Pool } from 'pg';
import { pauseTutor, unpauseTutor, PauseConflict, TutorNotFound } from '../src/services/pauseTutor';
import { approvePendingMatch } from '../src/services/approveMatch';

// Only runs when explicitly pointed at a test database; never uses application tables.
describe.skipIf(!process.env.TEST_DATABASE_URL)('pause tutor', () => {
  const schema = `pause_test_${randomUUID().replace(/-/g, '')}`;
  let admin: Pool;
  let pool: Pool;

  beforeAll(async () => {
    admin = new Pool({ connectionString: process.env.TEST_DATABASE_URL });
    pool = new Pool({ connectionString: process.env.TEST_DATABASE_URL, options: `-c search_path=${schema}` });
    await admin.query(`CREATE SCHEMA "${schema}"`);
    await pool.query(`
      CREATE TABLE tutor (id varchar(7) PRIMARY KEY, priority boolean DEFAULT true,
        status varchar(10) NOT NULL DEFAULT 'active');
      CREATE TABLE tutee (id integer PRIMARY KEY, priority boolean DEFAULT true);
      CREATE TABLE unmatched (id serial PRIMARY KEY, tutor_id varchar(7), tutee_id integer);
      CREATE TABLE matched (id serial PRIMARY KEY, tutor_id varchar(7), tutee_id integer);
      CREATE TABLE approved_matches (id serial PRIMARY KEY, tutor_id varchar(7), tutee_id integer,
        pair_date date NOT NULL, active boolean DEFAULT true);
    `);
  });

  afterAll(async () => {
    await pool?.end();
    await admin?.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
    await admin?.end();
  });

  // abc1234 is unmatched; def5678 has no open spot (e.g. in history)
  async function reset() {
    await pool.query(`TRUNCATE tutor, tutee, unmatched, matched, approved_matches RESTART IDENTITY;
      INSERT INTO tutor (id) VALUES ('abc1234'), ('def5678');
      INSERT INTO tutee (id) VALUES (1);
      INSERT INTO unmatched (tutor_id) VALUES ('abc1234');
      INSERT INTO unmatched (tutee_id) VALUES (1);`);
  }
  const status = async (id: string) =>
    (await pool.query('SELECT status FROM tutor WHERE id = $1', [id])).rows[0].status;
  const pending = async () =>
    (await pool.query('SELECT count(*)::int AS count FROM unmatched')).rows[0].count;

  it('pauses an unmatched tutor and keeps their open spot', async () => {
    await reset();
    await pauseTutor(pool, 'abc1234');
    assert.equal(await status('abc1234'), 'paused');
    assert.equal(await pending(), 2);
  });

  it('pausing twice is harmless', async () => {
    await reset();
    await pauseTutor(pool, 'abc1234');
    await pauseTutor(pool, 'abc1234');
    assert.equal(await status('abc1234'), 'paused');
  });

  it('unpausing makes the tutor active again', async () => {
    await reset();
    await pauseTutor(pool, 'abc1234');
    await unpauseTutor(pool, 'abc1234');
    assert.equal(await status('abc1234'), 'active');
    assert.equal(await pending(), 2);
  });

  it('refuses to pause a tutor with an active match', async () => {
    await reset();
    await approvePendingMatch(pool, { tutorId: 'abc1234', selectedTuteeId: 1, unmatchedTutorId: 1 });
    // give them another open spot, like a tutor who takes two tutees
    await pool.query(`INSERT INTO unmatched (tutor_id) VALUES ('abc1234')`);
    await assert.rejects(pauseTutor(pool, 'abc1234'), PauseConflict);
    assert.equal(await status('abc1234'), 'active');
  });

  it('allows pausing once the match is no longer active', async () => {
    await reset();
    await approvePendingMatch(pool, { tutorId: 'abc1234', selectedTuteeId: 1, unmatchedTutorId: 1 });
    await pool.query(`UPDATE approved_matches SET active = false;
      DELETE FROM matched;
      INSERT INTO unmatched (tutor_id) VALUES ('abc1234')`);
    await pauseTutor(pool, 'abc1234');
    assert.equal(await status('abc1234'), 'paused');
  });

  it('refuses to pause a tutor with no open spot', async () => {
    await reset();
    await assert.rejects(pauseTutor(pool, 'def5678'), PauseConflict);
    assert.equal(await status('def5678'), 'active');
  });

  it('reports unknown tutors', async () => {
    await reset();
    await assert.rejects(pauseTutor(pool, 'zzz9999'), TutorNotFound);
    await assert.rejects(unpauseTutor(pool, 'zzz9999'), TutorNotFound);
  });

  it('a pause and an approval racing for the same tutor never leave a paused tutor matched', async () => {
    for (let i = 0; i < 5; i++) {
      await reset();
      await Promise.allSettled([
        pauseTutor(pool, 'abc1234'),
        approvePendingMatch(pool, { tutorId: 'abc1234', selectedTuteeId: 1, unmatchedTutorId: 1 }),
      ]);
      const paired = (await pool.query('SELECT count(*)::int AS count FROM approved_matches WHERE active')).rows[0].count;
      assert.ok(!(paired === 1 && (await status('abc1234')) === 'paused'));
    }
  });
});
