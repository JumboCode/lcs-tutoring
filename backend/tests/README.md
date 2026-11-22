Run the database regression suite from `backend` with `TEST_DATABASE_URL` set to a PostgreSQL test database, then `npm test`.

On Neon, use the **direct (unpooled)** connection string: the same host without `-pooler`. The pooled endpoint rejects the `search_path` startup option these tests use, and every suite fails with `unsupported startup parameter in options: search_path`.

The suite creates a randomly named schema, uses that schema for all fixtures and queries, and drops it in cleanup. It never reads or changes application tables. Without `TEST_DATABASE_URL`, the integration suite is skipped. Tests cover sequential retries, ten concurrent approvals, competing tutors, stale pending slots, transaction rollback, and re-pairing after unmatching.

Run UI regressions from `frontend` with `npm test`. Authentication and HTTP responses are mocked; deferred responses verify that the pending item disappears before its refresh finishes, stale responses cannot restore it, duplicate clicks send one request, failures allow retry, and custom approvals follow the same flow.
