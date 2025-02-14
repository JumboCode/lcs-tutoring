import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import {
  matchedTable,
  tuteeTable,
  tutorTable,
  unmatchedTable,
  historyTable,
  approvedMatchesTable,
  adminTable,
} from "./db/schema";
import { or, inArray, arrayContains, and, eq } from "drizzle-orm";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import fs from "fs";
import { Resend } from "resend";

const resend = new Resend(process.env.RESENDAPIKEY!);

const db = drizzle(process.env.DATABASE_URL!);

const app: Express = express();
app.use(cors());
app.use(express.json());

const port = 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.get("/demo/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    res.send(`Here is our message: ${id}`);
  } catch (error) {
    console.error(error);
  }
});

/* GET endpoint -- returns all the matched and unmatched tutees */
app.get("/tutees", async (req: Request, res: Response) => {
  try {
    console.log("Inside tutees endpoint");
    const matchedTutees = await db
      .select()
      .from(tuteeTable)
      .innerJoin(matchedTable, eq(tuteeTable.id, matchedTable.tutee_id));

    const unmatchedTutees = await db
      .select()
      .from(tuteeTable)
      .innerJoin(unmatchedTable, eq(tuteeTable.id, unmatchedTable.tutee_id));

    const historyTutees = await db
      .select()
      .from(tuteeTable)
      .innerJoin(historyTable, eq(tuteeTable.id, historyTable.tutee_id));

    res.send({
      matchedTutees: matchedTutees.map((row) => row.tutee),
      unmatchedTutees: unmatchedTutees.map((row) => row.tutee),
      historyTutees: historyTutees.map((row) => row.tutee),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching tutees");
  }
});

export async function moveToInactive(matchId: number) {
  // Get the match details first
  const [match] = await db
    .select()
    .from(approvedMatchesTable)
    .where(eq(approvedMatchesTable.id, matchId));

  if (!match) {
    throw new Error("Match not found");
  }

  // Insert both tutor and tutee into unmatched table
  await db.insert(unmatchedTable).values([
    {
      tutee_id: match.tutee_id,
      tutor_id: match.tutor_id,
      flagged: false,
    },
  ]);
}
// backend/src/index.ts
app.post("/flag/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const [match] = await db
      .select()
      .from(approvedMatchesTable)
      .where(eq(approvedMatchesTable.id, id));

    const [updated] = await db
      .update(approvedMatchesTable)
      .set({ flagged: !match.flagged })
      .where(eq(approvedMatchesTable.id, id))
      .returning();

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating flag status");
  }
});
/* GET endpoint -- returns all the matched and unmatched tutors */
app.get("/tutors", async (req: Request, res: Response) => {
  console.log("im in");
  try {
    const filteredTutors = await filterTutors(
      [11, 12],
      undefined,
      true,
      undefined
    );
    const tutorIds = filteredTutors
      .map((tutor) => tutor.id)
      .filter((id) => id !== undefined);

    const matchedTutors = await db
      .select()
      .from(tutorTable) //Getting all tutors but instead want to just get filtered
      .innerJoin(matchedTable, eq(tutorTable.id, matchedTable.tutor_id))
      .where(inArray(tutorTable.id, tutorIds));

    const unmatchedTutors = await db
      // .select()
      // .from(tutorTable)
      // .innerJoin(unmatchedTable, eq(tutorTable.id, unmatchedTable.tutee_or_tutor_id));
      .select()
      .from(tutorTable) // Getting all tutors but instead want to just get filtered
      .innerJoin(unmatchedTable, eq(tutorTable.id, unmatchedTable.tutor_id))
      .where(inArray(tutorTable.id, tutorIds));
    
    const historyTutors = await db
      .select()
      .from(tutorTable)
      .innerJoin(historyTable, eq(tutorTable.id, historyTable.tutor_id));

    res.send({
      matchedTutors: matchedTutors.map((row) => row.tutor),
      unmatchedTutors: unmatchedTutors.map((row) => row.tutor),
      historyTutors: historyTutors.map((row) => row.tutor),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching tutors");
  }
});

app.get("/approved-matches", async (req: Request, res: Response) => {
  try {
    console.log("Inside approved matches endpoint");
    // query logic
    const active_matches = await db
      .select({
        matchId: approvedMatchesTable.id,
        flagged: approvedMatchesTable.flagged,
        tutor: {
          id: tutorTable.id,
          first_name: tutorTable.first_name,
          last_name: tutorTable.last_name,
          email: tutorTable.email,
          major: tutorTable.major,
          tutoring_mode: tutorTable.tutoring_mode,
        },
        tutee: {
          id: tuteeTable.id,
          tutee_first_name: tuteeTable.tutee_first_name,
          tutee_last_name: tuteeTable.tutee_last_name,
          grade: tuteeTable.grade,
          parent_email: tuteeTable.parent_email,
          subjects: tuteeTable.subjects,
          tutoring_mode: tuteeTable.tutoring_mode,
        },
      })
      .from(approvedMatchesTable)
      .innerJoin(tutorTable, eq(approvedMatchesTable.tutor_id, tutorTable.id))
      .innerJoin(tuteeTable, eq(approvedMatchesTable.tutee_id, tuteeTable.id))
      .where(eq(approvedMatchesTable.active, true));

      const inactive_matches = await db
      .select({
        matchId: approvedMatchesTable.id,
        flagged: approvedMatchesTable.flagged,
        tutor: {
          id: tutorTable.id,
          first_name: tutorTable.first_name,
          last_name: tutorTable.last_name,
          email: tutorTable.email,
          major: tutorTable.major,
          tutoring_mode: tutorTable.tutoring_mode,
        },
        tutee: {
          id: tuteeTable.id,
          tutee_first_name: tuteeTable.tutee_first_name,
          tutee_last_name: tuteeTable.tutee_last_name,
          grade: tuteeTable.grade,
          parent_email: tuteeTable.parent_email,
          subjects: tuteeTable.subjects,
          tutoring_mode: tuteeTable.tutoring_mode,
        },
      })
      .from(approvedMatchesTable)
      .innerJoin(tutorTable, eq(approvedMatchesTable.tutor_id, tutorTable.id))
      .innerJoin(tuteeTable, eq(approvedMatchesTable.tutee_id, tuteeTable.id))
      .where(eq(approvedMatchesTable.active, false));

    res.send({
      activeApprovedMatches: active_matches,
      inactiveApprovedMatches: inactive_matches,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching approved matches");
  }
});

/* GET endpoint */
app.get("/match-suggestions", async (req: Request, res: Response) => {
  try {
    console.log("Inside match suggestions endpoint");
    // query logic
    // NOTE: Algorithm implementation somewhere here

    const matches = await db
      .select({
        matchId: unmatchedTable.id,
        flagged: unmatchedTable.flagged,
        tutor: {
          id: tutorTable.id,
          first_name: tutorTable.first_name,
          last_name: tutorTable.last_name,
          phone: tutorTable.phone,
          email: tutorTable.email,
          subject: tutorTable.subject_pref,
          grade_level_pref: tutorTable.grade_level_pref,
          disability_pref: tutorTable.disability_pref,
          tutoring_mode: tutorTable.tutoring_mode,
        },
        // TUTEE SUGGESTIONS FROM ALGORITHM
      })
      .from(unmatchedTable)
      .innerJoin(tutorTable, eq(unmatchedTable.tutor_id, tutorTable.id));

    res.send({
      matchSuggestions: matches,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching match suggestions");
  }
});

app.post("/move-to-inactive/:id", async (req: Request, res: Response) => {
  try {
    console.log("inside move to inactive");
    const id = req.params.id;
  
    moveToInactive(Number(id));
    console.log("after function call");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error moving to inactive");
  }
});

app.post("/admin/:email", async (req: Request, res: Response) => {
  try {
    const email = req.params.email;
    await db.insert(adminTable).values({
      email: email,
    });
    console.log("Email submitted: ", req.body);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding new admin");
  }
});
app.post("/move-to-inactive/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    // Move tutor & tutee to unmatched table
    await moveToInactive(id);

    // Remove the match from approved_matches
    await db
      .delete(approvedMatchesTable)
      .where(eq(approvedMatchesTable.id, id));

    // db.delete(approvedMatchesTable).where(eq(approvedMatchesTable.id, id));
    console.log(`Match ${id} moved to inactive`);
    res.send("Match moved to inactive");
  } catch (error) {
    console.error("Error moving to inactive:", error);
    res.status(500).send("Error moving to inactive");
  }
});

app.post("/tuteesubmission", async (req: Request, res: Response) => {
  try {
    console.log("This the req body: ", req.body);
    const request = req.body;
    const {
      id,
      childFirstName,
      childLastName,
      gender,
      grade,
      specialNeeds,
      specialNeedsInfo,
      parentFirstName,
      parentLastName,
      phone,
      email,
      subjects,
      tutoringMode,
      additionalInfo,
      agreement,
      signature,
    } = request;
    // bad practice, prefer to submit number directly
    const gradeNum = Number(grade);
    console.log("This the subjects: ", subjects);
    await db.insert(tuteeTable).values({
      id: id,
      tutee_first_name: childFirstName,
      tutee_last_name: childLastName,
      gender: gender,
      grade: gradeNum,
      has_special_needs: specialNeeds === "yes",
      special_needs: specialNeedsInfo,
      parent_first_name: parentFirstName,
      parent_last_name: parentLastName,
      parent_phone: phone,
      parent_email: email,
      subjects: subjects,
      tutoring_mode: tutoringMode,
      notes: additionalInfo,
      date: new Date().toISOString().split("T")[0],
    });
    console.log("Tutee submitted: ", req.body);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error moving to matched");
  }
});

app.get("/email", async (req: Request, res: Response) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "LCSTutoring <onboarding@resend.dev>",
      to: ["brandon.dionisio@tufts.edu"],
      subject: "hello world",
      html: "<strong>it works!</strong>",
    });
    console.log("Data: ", data)
    console.log("Error: ", error)
  } catch (error) {
    console.error(error);
  }
});

app.post("/tutorsubmission", async (req: Request, res: Response) => {
  try {
    console.log("This the req body: ", req.body);
    const request = req.body;
    const {
      firstName,
      lastName,
      pronouns,
      id,
      major,
      yearGrad,
      phone,
      email,
      pairedWithTutee,
      pairedTutee,
      numTutees,
      gradeLevels,
      comfortableSpecialNeeds,
      subjects,
      languageProficiencies,
      tutoringMode,
      notes,
      agreement,
      signature,
    } = request;
    await db.insert(tutorTable).values({
      id: id,
      first_name: firstName,
      last_name: lastName,
      pronouns: pronouns,
      major: major,
      year_grad: yearGrad,
      phone: phone,
      email: email,
      grade_level_pref: gradeLevels,
      disability_pref: comfortableSpecialNeeds,
      subject_pref: subjects,
      tutoring_mode: tutoringMode,
      date: new Date().toISOString().split("T")[0],
      previous_tutee: pairedWithTutee,
      continuing_tutee_name: pairedTutee,
      num_tutees: numTutees,
      notes: notes,
      language_proficiencies: languageProficiencies,
    });
    console.log("Tutee submitted: ", req.body);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error moving to matched");
  }
});

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

app.post("/move-tutor-to-history/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    // const request = req.body;
    moveTutorToHistory(id);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error moving to history");
  }
});

app.post("/move-tutee-to-history/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    console.log("id as a string: ", id);
    console.log(Number(id));
    moveTuteeToHistory(Number(id));
  } catch (error) {
    console.error(error);
    res.status(500).send("Error moving to history");
  }
});

async function moveTutorToHistory(tutor_id: string) {
  if (tutor_id.length == 7 || tutor_id.length == 8) {
    const query = await db
      .select()
      .from(matchedTable)
      .where(eq(matchedTable.tutor_id, tutor_id)); //returns an array with only one element

    if (query.length > 0) {
      await db.insert(historyTable).values(query[0]); //inserts only one row into matchedTable

      await db.delete(matchedTable).where(eq(matchedTable.tutor_id, tutor_id));

      // for (let i = 0; i < query.length - 1; i++) {
      //   //adding rows back in
      //   await db.insert(matchedTable).values(query[0]);
      // }
    } else {
      throw new Error("ID not found in matched table");
    }
  } else {
    throw new Error("Invalid ID");
  }
}

async function moveTuteeToUnmatched(tutee_id: number) {
  const query = await db
    .select()
    .from(matchedTable)
    .where(eq(matchedTable.tutee_id, tutee_id));
  console.log(query);

  if (!query) {
    throw new Error("${id} does not exist in matched table");
  }

  await db
    .insert(unmatchedTable)
    .values(query)
    .onConflictDoNothing(); 

  await db.delete(matchedTable).where(eq(matchedTable.tutee_id, tutee_id));
}

async function moveToInactive(matchId: number) {
  console.log("moving to inactive");
  const query = await db
    .select()
    .from(approvedMatchesTable)
    .where(eq(approvedMatchesTable.id, matchId));
  console.log(query); 

  moveTutorToUnmatched(query[0].tutor_id);
  moveTuteeToUnmatched(query[0].tutee_id);
  await db
    .update(approvedMatchesTable)
    .set({ active: false })
    .where(eq(approvedMatchesTable.id, matchId));
}

async function moveTuteeToHistory(tutee_id: number) {
  console.log("in move tutee to history");
  if (tutee_id > 0) {
    const query = await db
      .select()
      .from(matchedTable)
      .where(eq(matchedTable.tutee_id, tutee_id)); //returns an array with only one element

    if (query.length > 0) {
      await db.insert(historyTable).values(query[0]); //inserts only one row into matchedTable

      await db.delete(matchedTable).where(eq(matchedTable.tutee_id, tutee_id));

      // for (let i = 0; i < query.length - 1; i++) {
      //   //adding rows back in
      //   await db.insert(matchedTable).values(query[0]);
      // }
    } else {
      throw new Error("ID not found in matched table");
    }
  } else {
    throw new Error("Invalid ID");
  }
}

// Execute both functions
const importData = async () => {
  await importUnmatchedData();
  await importMatchedData();
};

importData().catch((err) => {
  console.error("Error importing data:", err);
});

/**** Filter Tutors by grade levels and subject prefs ****
 *
 * Example input: filterTutors([9, 10], undefined)
 *  - Should return all tutors that have selected 9th or
 *    10th graders in their grade preferences
 *
 * Pass in "undefined" to not filter by something
 *
 * You can console.log all the tutors that the query returns
 * to verify a correct output
 *********************************************************/
async function filterTutors(
  gradeLevels?: number[],
  subject_pref?: string[],
  disabilityPref?: boolean,
  tutoringMode?: string
) {
  const query = db.select().from(tutorTable);

  const conditions: any[] = [];

  if (subject_pref && subject_pref.length > 0) {
    const condition_subject = subject_pref.map((subject) =>
      arrayContains(tutorTable.subject_pref, [subject])
    );
    conditions.push(or(...condition_subject));
  }

  if (gradeLevels && gradeLevels.length > 0) {
    const condition_grade = gradeLevels.map((grade) =>
      arrayContains(tutorTable.grade_level_pref, [grade])
    );
    conditions.push(or(...condition_grade));
  }

  if (disabilityPref != undefined) {
    conditions.push(or(eq(tutorTable.disability_pref, disabilityPref)));
  }

  if (tutoringMode != undefined) {
    conditions.push(or(eq(tutorTable.tutoring_mode, tutoringMode)));
  }

  if (conditions.length > 0) {
    query.where(and(...conditions));
  }

  const tutors = await query;

  console.log("Filtered Tutors:", tutors);

  return tutors;
}

// filterTutors([10], ["Writing", "Algebra"], false, "In-Person").then(tutors => console.log(tutors));
// moveToMatched("1000002");

/******* Move a given tutor/tutee from unmatched to matched *******
 *
 *  - given a tutor or tutee's id, move them from the unmatched table to the
 *    matched table
 *
 *  - throw an error if they don't exist in the unmatched table
 *
 *  - it is ok if the tables have duplicate ids, you just have to move 1.
 *
 ******************************************************************/
async function moveTutorToMatched(tutor_id: string) {
  if (tutor_id.length == 7 || tutor_id.length == 8) {
    const query = await db
      .select()
      .from(unmatchedTable)
      .where(eq(unmatchedTable.tutor_id, tutor_id)); //returns an array with only one element
    const remain = query.length - 1;
    if (query.length > 0) {
      await db.insert(matchedTable).values(query[0]); //inserts only one row into matchedTable

      await db
        .delete(unmatchedTable)
        .where(eq(unmatchedTable.tutor_id, tutor_id));

      for (let i = 0; i < query.length - 1; i++) {
        //adding rows back in
        await db.insert(unmatchedTable).values(query[0]);
      }
    } else {
      throw new Error("ID not found in unmatched table");
    }
  } else {
    throw new Error("Invalid ID");
  }
}

// moveTutorToMatched("1000002");

/******* Move a given tutor/tutee from matched to unmatched *******
 *
 *  - given a tutor or tutee's id, move them from the matched table to the
 *    unmatched table
 *
 *  - throw an error if they don't exist in the matched table
 *
 *  - it is ok if the tables have duplicate ids, you just have to move 1.
 *
 ******************************************************************/
async function moveTutorToUnmatched(tutor_id: string) {
  if (tutor_id.length == 7) {
    const query = await db
      .select()
      .from(matchedTable)
      .where(eq(matchedTable.tutor_id, tutor_id));
    console.log(query);

    if (!query) {
      throw new Error("${id} does not exist in matched table");
    }

    await db
      .insert(unmatchedTable)
      .values(query)
      .onConflictDoNothing(); 
    await db.delete(matchedTable).where(eq(matchedTable.tutor_id, tutor_id));
  }
}

/************** Make a match given tutor and tutee ids ***************
 *
 *  - Given a tutor id and a tutee id, find the ids in the tutor and tutee
 *    unmatched tables and move them to matched
 *
 *  - Create a new row in the approved_matched table that contains the
 *    tutor and tutee ids
 *
 *  - Throw an error if either the tutor or tutee don't exist in the unmatched
 *    table
 */
async function createMatch(tutor_id: string, tutee_id: string) {}

async function fetchAllTutees() {
  const query = await db.select().from(tuteeTable);
  const tutees = query;
  return tutees;
}
