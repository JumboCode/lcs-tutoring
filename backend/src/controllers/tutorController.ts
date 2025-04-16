/***********************************************
 * This file is for the routes and function imps involving tutors
 ***********************************************/

import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import {
  matchedTable,
  tutorTable,
  unmatchedTable,
  historyTable,
} from "../db/schema";
import { or, inArray, arrayContains, and, eq } from "drizzle-orm";
import { Request, Response } from "express";

const db = drizzle(process.env.DATABASE_URL!);

/* returns all the matched and unmatched tutors with filter */
export const getTutors = async (req: Request, res: Response) => {
  try {
    let { gradeLevels, selectedSubjects, tutoringMode, disability } = req.query;

    // converting URL query string to arrays
    let grades: number[] | undefined = [];
    if (typeof gradeLevels === "string") {
      grades = gradeLevels.split(",").map(Number);
    } else if (Array.isArray(gradeLevels)) {
      grades = gradeLevels.map(Number);
    }
    // set to undefined if grades == 0
    if (grades[0] === 0) {
      grades = undefined;
    } else {
      // kindergarten is -1 because query url default undefined is [0]
      grades = grades.map((grade) => (grade === -1 ? 0 : grade))
    }

    // converting URL query string to arrays
    let subjects: string[] | undefined = [];
    if (typeof selectedSubjects === "string") {
      subjects = selectedSubjects.split(",").map((subject) => subject.trim());
    } else if (Array.isArray(selectedSubjects)) {
      subjects = selectedSubjects.map(String);
    }
    // set to undefined if subjects is [""]
    subjects = subjects.filter((subject) => subject.trim() !== "");
    subjects = subjects.length > 0 ? subjects : undefined;

    if (!tutoringMode) {
      tutoringMode = undefined;
    }

    let disability_pref: boolean | undefined = false;
    if (disability === "true") {
      disability_pref = true;
    } else if (disability === "false") {
      disability_pref = false;
    } else {
      disability_pref = undefined;
    }
    
    console.log("grades:", grades);
    console.log("subjects:", subjects);
    console.log("tutoring mode:", tutoringMode);
    console.log("disability:", disability_pref);
    // applying the filter
    const filteredTutors = await filterTutors(
      grades,
      subjects,
      disability_pref,
      tutoringMode?.toString(),
    );

    console.log(filteredTutors);

    // getting all ids of the filtered tutors
    const tutorIds = filteredTutors
      .map((tutor: any) => tutor.id)
      .filter((id: any) => id !== undefined);

    const matchedTutors = await db
      .selectDistinct()
      .from(tutorTable)
      .innerJoin(matchedTable, eq(tutorTable.id, matchedTable.tutor_id))
      .where(inArray(tutorTable.id, tutorIds));

    const unmatchedTutors = await db
      .selectDistinct()
      .from(tutorTable)
      .innerJoin(unmatchedTable, eq(tutorTable.id, unmatchedTable.tutor_id))
      .where(inArray(tutorTable.id, tutorIds));
    
    const historyTutors = await db
      .selectDistinct()
      .from(tutorTable)
      .innerJoin(historyTable, eq(tutorTable.id, historyTable.tutor_id))
      .where(inArray(tutorTable.id, tutorIds));

    res.send({
      matchedTutors: matchedTutors.map((row: any) => row.tutor),
      unmatchedTutors: unmatchedTutors.map((row: any) => row.tutor),
      historyTutors: historyTutors.map((row: any) => row.tutor),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching tutors");
  }
};

/* returns all the matched and unmatched tutors with filter */
export const getUnmatchedTutors = async (req: Request, res: Response) => {
  try {
    // applying the filter
    const filteredTutors = await filterTutors(
      undefined,
      undefined,
      undefined,
      undefined
    );

    // getting all ids of the filtered tutors
    const tutorIds = filteredTutors
      .map((tutor: any) => tutor.id)
      .filter((id: any) => id !== undefined);

    // getting the unmatched tutors with the filtered ids
    const unmatchedTutors = await db
      .select()
      .from(tutorTable)
      .innerJoin(unmatchedTable, eq(tutorTable.id, unmatchedTable.tutor_id))
      .where(inArray(tutorTable.id, tutorIds));

    res.send({
      unmatchedTutors: unmatchedTutors.map((row: any) => row.tutor),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching tutors");
  }
};

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

  // console.log("Filtered Tutors:", tutors);

  return tutors;
}

export const unmatchedToHistory = async (req: Request, res: Response) => {
  try {
    const tutor_id = req.params.id;
    // const request = req.body;
    if (tutor_id.length == 7 || tutor_id.length == 8) {
      const query = await db
        .select()
        .from(unmatchedTable)
        .where(eq(unmatchedTable.tutor_id, tutor_id)); //returns an array with only one element
  
      if (query.length > 0) {
        await db.update(tutorTable)
          .set({ history_date: new Date().toISOString().split("T")[0], })
          .where(eq(tutorTable.id, tutor_id));

        await db.insert(historyTable).values(query[0]);
  
        await db.delete(unmatchedTable).where(eq(unmatchedTable.tutor_id, tutor_id));
        
        res.json({ success: true, message: "Tutor moved" });

      } else {
        throw new Error("ID not found in matched table");
      }
    } else {
      throw new Error("Invalid ID");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error moving to history");
  }
};

export const unmatchedToMatched = async (req: Request, res: Response) => {
    // TODO: Implement logic
    console.error("not implemented yet");
}

/******* Move a given tutor from unmatched to matched *******
 *
 *  - given a tutor's id, move them from the unmatched table to the
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
  

export const permDeleteTutor = async (req: Request, res: Response) => {
    console.log("in backend for perm delete")
    try {
      const tutor_id = req.params.id;
      await db.delete(historyTable).where(eq(historyTable.tutor_id, tutor_id));
      await db.delete(tutorTable).where(eq(tutorTable.id, tutor_id));
      res.status(200).json({ message: "Tutor permanently deleted" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error permanently deleting tutor", error: error});
    }
}