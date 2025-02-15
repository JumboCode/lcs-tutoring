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
    // applying the filter
    const filteredTutors = await filterTutors(
      undefined,
      undefined,
      true,
      undefined
    );

    // getting all ids of the filtered tutors
    const tutorIds = filteredTutors
      .map((tutor) => tutor.id)
      .filter((id) => id !== undefined);

    // getting the matched tutors with the filtered ids
    const matchedTutors = await db
      .select()
      .from(tutorTable)
      .innerJoin(matchedTable, eq(tutorTable.id, matchedTable.tutor_id))
      .where(inArray(tutorTable.id, tutorIds));

    // getting the unmatched tutors with the filtered ids
    const unmatchedTutors = await db
      .select()
      .from(tutorTable)
      .innerJoin(unmatchedTable, eq(tutorTable.id, unmatchedTable.tutor_id))
      .where(inArray(tutorTable.id, tutorIds));
    
    // getting the history tutors with the filtered ids
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

  console.log("Filtered Tutors:", tutors);

  return tutors;
}

export const matchedToHistory = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    // const request = req.body;
    moveTutorToHistory(id);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error moving to history");
  }
};

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
  