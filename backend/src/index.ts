import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import fs from "fs";
import tutor_router from "./routes/tutors";
import tutee_router from "./routes/tutees";
import approved_matches_router from "./routes/approvedMatches";
import match_suggestions_router from "./routes/matchSuggestions";
import form_router from "./routes/form";

const app: Express = express();
app.use(cors());
app.use(express.json());
app.use(
  tutor_router,
  tutee_router,
  approved_matches_router,
  match_suggestions_router,
  form_router
);

const port = 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Serverss");
});

// functions for importing the json data into the DB for testing
// const importUnmatchedData = async () => {
//   const jsonData = JSON.parse(fs.readFileSync("src/unmatched.json", "utf-8"));

//   for (const record of jsonData) {
//     await db.insert(unmatchedTable).values({
//       tutee_id: record.tutee_id,
//       tutor_id: record.tutor_id,
//     });
//   }
// };

// const importMatchedData = async () => {
//   const jsonData = JSON.parse(fs.readFileSync("src/matched.json", "utf-8"));

//   for (const record of jsonData) {
//     await db.insert(matchedTable).values({
//       tutee_id: record.tutee_id,
//       tutor_id: record.tutor_id,
//     });
//   }
// };

// Execute both functions
// const importData = async () => {
//   await importUnmatchedData();
//   await importMatchedData();
// };

// importData().catch((err) => {
//   console.error("Error importing data:", err);
// });

/*
delete FROM matched;

TRUNCATE TABLE matched RESTART IDENTITY;

INSERT INTO matched (tutee_id, tutor_id)
VALUES 
  (NULL, '1000002'),
  (NULL, '1000004'),
  (NULL, '1000006'),
  (NULL, '1000008'),
  (NULL, '1000010'),
  (NULL, '1000012'),
  (NULL, '1000014'),
  (NULL, '1000016'),
  (NULL, '1000018'),
  (NULL, '1000020'),
  (2,NULL),
  (4,NULL),
  (6,NULL),
  (8,NULL),
  (10,NULL),
  (12,NULL),
  (14,NULL),
  (16,NULL),
  (18,NULL),
  (20,NULL);
*/

/*
DELETE FROM unmatched;

TRUNCATE TABLE unmatched RESTART IDENTITY;

INSERT INTO unmatched (tutee_id, tutor_id)
VALUES 
  (NULL, '1000001'),
  (NULL, '1000003'),
  (NULL, '1000005'),
  (NULL, '1000007'),
  (NULL, '1000009'),
  (NULL, '1000011'),
  (NULL, '1000013'),
  (NULL, '1000015'),
  (NULL, '1000017'),
  (NULL, '1000019'),
  (1,NULL),
  (3,NULL),
  (5,NULL),
  (7,NULL),
  (9,NULL),
  (11,NULL),
  (13,NULL),
  (15,NULL),
  (17,NULL),
  (19,NULL);
*/
