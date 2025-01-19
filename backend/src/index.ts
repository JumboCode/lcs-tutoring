import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import {
  matchedTable,
  tuteeTable,
  tutorTable,
  unmatchedTable,
  approvedMatchesTable,
  adminTable
} from "./db/schema";
import { or, inArray, arrayContains, and, eq } from "drizzle-orm";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import fs from 'fs';

const db = drizzle(process.env.DATABASE_URL!);

const app: Express = express();
app.use(cors());
app.use(express.json());

const port = process.env.PGPORT || 3000;

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
})

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

    res.send({
      matchedTutees: matchedTutees.map((row) => row.tutee),
      unmatchedTutees: unmatchedTutees.map((row) => row.tutee),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching tutees");
  }
});

/* GET endpoint -- returns all the matched and unmatched tutors */
app.get("/tutors", async (req: Request, res: Response) => {
    try {
      const filteredTutors = await filterTutors([11,12], undefined, true, undefined);
      const tutorIds = filteredTutors.map((tutor) => tutor.id).filter((id) => id !== undefined);

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
        .from(tutorTable) //Getting all tutors but instead want to just get filtered
        .innerJoin(unmatchedTable, eq(tutorTable.id, unmatchedTable.tutor_id))
        .where(inArray(tutorTable.id, tutorIds));
  
      res.send({
        matchedTutors: matchedTutors.map((row) => row.tutor),
        unmatchedTutors: unmatchedTutors.map((row) => row.tutor)
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error fetching tutors");
    }
  });

  app.post("/admin/:email", async (req: Request, res: Response) => {
    try {
      const email = req.params.email;
      await db.insert(adminTable).values({
        email: email
      });
      console.log("Email submitted: ", req.body);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error adding new admin");
    }
  });

app.post("/tuteesubmission", async (req: Request, res: Response) => {
  try {
    console.log("This the req body: ", req.body);
    const request = req.body;
    const { childFirstName, childLastName, gender, grade, specialNeeds, specialNeedsInfo, parentFirstName, parentLastName, phone, email, subject, tutoringMode, additionalInfo, agreement, signature } = request;
    // bad practice, prefer to submit number directly
    const gradeNum = Number(grade);
    console.log("This the grade num: ", gradeNum);
    await db.insert(tuteeTable).values({
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
      subject: subject,
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

app.post("/tutorsubmission", async (req: Request, res: Response) => {
  try {
    console.log("This the req body: ", req.body);
    const request = req.body;
    const { firstName, lastName, pronouns, id, major, yearGrad, phone, email, pairedWithTutee, pairedTutee, numTutees, gradeLevels, comfortableSpecialNeeds, subjects, languageProficiencies, tutoringMode, notes, agreement, signature } = request;
    // bad practice, prefer to submit number directly
    const gradeLevel = Number(gradeLevels);
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

      await db.delete(unmatchedTable).where(eq(unmatchedTable.tutor_id, tutor_id));

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

    await db.insert(unmatchedTable).values(query);
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