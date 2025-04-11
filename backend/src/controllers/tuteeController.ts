/***********************************************
 * This file is for the routes and function imps involving tutees
 ***********************************************/

import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import {
  matchedTable,
  tuteeTable,
  unmatchedTable,
  historyTable,
} from "../db/schema";
import { or, arrayContains, inArray, and, eq } from "drizzle-orm";
import { Request, Response } from "express";

const db = drizzle(process.env.DATABASE_URL!);

/* returns all the matched and unmatched tutees with the filter applied */
export const getTutees = async ( req: Request, res: Response) => {
  try {
    console.log("GETTING TUTEES")
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
    
    const filteredTutees = await filterTutees(
      grades,
      subjects,
      disability_pref,
      tutoringMode?.toString(),
    );

    // console.log(filteredTutees);

    // getting all ids of the filtered tutors
    const tuteeIds = filteredTutees
      .map((tutee) => tutee.id)
      .filter((id) => id !== undefined);

    const matchedTutees = await db
      .selectDistinct()
      .from(tuteeTable)
      .innerJoin(matchedTable, eq(tuteeTable.id, matchedTable.tutee_id))
      .where(inArray(tuteeTable.id, tuteeIds));

    const unmatchedTutees = await db
      .selectDistinct()
      .from(tuteeTable)
      .innerJoin(unmatchedTable, eq(tuteeTable.id, unmatchedTable.tutee_id))
      .where(inArray(tuteeTable.id, tuteeIds));

    const historyTutees = await db
      .selectDistinct()
      .from(tuteeTable)
      .innerJoin(historyTable, eq(tuteeTable.id, historyTable.tutee_id))
      .where(inArray(tuteeTable.id, tuteeIds));

    console.log("sending tutees");
    res.send({
      matchedTutees: matchedTutees.map((row) => row.tutee),
      unmatchedTutees: unmatchedTutees.map((row) => row.tutee),
      historyTutees: historyTutees.map((row) => row.tutee),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching tutees");
  }
};

/* returns all the unmatched tutees */
export const getUnmatchedTutees = async ( req: Request, res: Response) => {
  try {
    console.log("Inside unmatched tutees endpoint");

    const unmatchedTutees = await db
      .select()
      .from(tuteeTable)
      .innerJoin(unmatchedTable, eq(tuteeTable.id, unmatchedTable.tutee_id));

    res.send({
      unmatchedTutees: unmatchedTutees.map((row) => row.tutee),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching tutees");
  }
};

/**** Filter Tutees by grade levels and subjects ****
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
async function filterTutees(
  grades?: number[],
  subjects?: string[],
  disabilityPref?: boolean,
  tutoringMode?: string
) {
  const query = db.select().from(tuteeTable);

  const conditions: any[] = [];

  if (subjects && subjects.length > 0) {
    const condition_subject = subjects.map((subject) =>
      arrayContains(tuteeTable.subjects, [subject])
    );
    conditions.push(or(...condition_subject));
  }

  if (grades && grades.length > 0) {
    conditions.push(or(inArray(tuteeTable.grade, grades)));
  }

  if (disabilityPref != undefined) {
    conditions.push(or(eq(tuteeTable.has_special_needs, disabilityPref)));
  }

  if (tutoringMode != undefined) {
    conditions.push(or(eq(tuteeTable.tutoring_mode, tutoringMode)));
  }

  if (conditions.length > 0) {
    query.where(and(...conditions));
  }

  const tutees = await query;

  // console.log("Filtered Tutees:", tutees);

  return tutees;
}

/* Moves a tutee from UNMATCHED -> HISTORY given their id */
export const unmatchedToHistory = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    console.log("id as a string: ", id);
    console.log(Number(id));
    const tutee_id = (Number(id));
    if (tutee_id > 0) {
      const query = await db
        .select()
        .from(unmatchedTable)
        .where(eq(unmatchedTable.tutee_id, tutee_id)); //returns an array with only one element
  
      if (query.length > 0) {
        await db.update(tuteeTable)
          .set({ history_date: new Date().toISOString().split("T")[0], })
          .where(eq(tuteeTable.id, tutee_id));

        await db.insert(historyTable).values(query[0]); //inserts only one row into matchedTable
  
        await db.delete(unmatchedTable).where(eq(unmatchedTable.tutee_id, tutee_id));

        res.json({ success: true, message: "Tutee moved" });
  
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

export const permDeleteTutee = async (req: Request, res: Response) => {
  console.log("in backend for perm delete tutee")
  try {
    const tutee_id = req.params.id;
    await db.delete(tuteeTable).where(eq(tuteeTable.id, tutee_id));
  } catch (error) {
    console.error(error);
    res.status(500).send("Error permanently deleting tutor");
  }
}