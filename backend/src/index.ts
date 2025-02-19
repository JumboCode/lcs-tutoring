import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import {
  matchedTable,
  // tuteeTable,
  // tutorTable,
  unmatchedTable,
  // historyTable,
  // approvedMatchesTable,
  // adminTable,
} from "./db/schema";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import fs from "fs";
import tutor_router from "./routes/tutors";
import tutee_router from "./routes/tutees";
import approved_matches_router from "./routes/approvedMatches";
import match_suggestions_router from "./routes/matchSuggestions";
import form_router from "./routes/form";

const db = drizzle(process.env.DATABASE_URL!);

const app: Express = express();
app.use(cors());
app.use(express.json());
app.use(tutor_router, tutee_router, approved_matches_router, match_suggestions_router, form_router);

const port = 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

// functions for importing the json data into the DB for testing
const importUnmatchedData = async () => {
  const jsonData = JSON.parse(fs.readFileSync("src/unmatched.json", "utf-8"));

  for (const record of jsonData) {
    await db.insert(unmatchedTable).values({
      tutee_id: record.tutee_id,
      tutor_id: record.tutor_id,
    });
  }
};

const importMatchedData = async () => {
  const jsonData = JSON.parse(fs.readFileSync("src/matched.json", "utf-8"));

  for (const record of jsonData) {
    await db.insert(matchedTable).values({
      tutee_id: record.tutee_id,
      tutor_id: record.tutor_id,
    });
  }
};


// Execute both functions
const importData = async () => {
  await importUnmatchedData();
  await importMatchedData();
};

importData().catch((err) => {
  console.error("Error importing data:", err);
});