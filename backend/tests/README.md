Run the database regression suite from `backend` with `TEST_DATABASE_URL` set to a PostgreSQL test database, then `npm test`.

The suite creates a randomly named schema, uses that schema for all fixtures and queries, and drops it in cleanup. It never reads or changes application tables. Without `TEST_DATABASE_URL`, the integration suite is skipped. Tests cover sequential retries, ten concurrent approvals, competing tutors, stale pending slots, transaction rollback, and re-pairing after unmatching.

Run UI regressions from `frontend` with `npm test`. Authentication and HTTP responses are mocked; deferred responses verify that the pending item disappears before its refresh finishes, stale responses cannot restore it, duplicate clicks send one request, failures allow retry, and custom approvals follow the same flow.
