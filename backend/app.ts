// require('dotenv').config();
// const { Pool } = require('pg');
// const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, PGPORT } = process.env;
// const pool = new Pool({
//   host: PGHOST,
//   database: PGDATABASE,
//   username: PGUSER,
//   password: PGPASSWORD,
//   port: PGPORT,
//   ssl: {
//     require: true,
//   },
// });

// async function getPgVersion() {
//   const client = await pool.connect();
//   try {
//     const result = await client.query('SELECT version()');
//     console.log(result.rows[0]);
//   } finally {
//     client.release();
//   }
// }
// getPgVersion();