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
  TUTOR_STATUS,
} from "../db/schema";
import { or, inArray, notInArray, arrayContains, and, eq } from "drizzle-orm";
import { Request, Response } from "express";
import { Pool } from "pg";
import {
  pauseTutor as pauseTutorService,
  unpauseTutor as unpauseTutorService,
  getTutorStatus,
  PauseConflict,
  TutorNotFound,
} from "../services/pauseTutor";

const db = drizzle(process.env.DATABASE_URL!);
const pausePool = new Pool({ connectionString: process.env.DATABASE_URL });

// tutor ids are varchar(7)
const tutorIdParam = (req: Request) => {
  const id = req.params.id;
  return typeof id === "string" && id.trim() && id.length <= 7 ? id : null;
};

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
      grades = grades.map((grade) => (grade === -1 ? 0 : grade));
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
    // applying the filter
    const filteredTutors = await filterTutors(
      grades,
      subjects,
      disability_pref,
      tutoringMode?.toString()
    );

    // console.log(filteredTutors);

    // getting all ids of the filtered tutors
    const tutorIds = filteredTutors
      .map((tutor: any) => tutor.id)
      .filter((id: any) => id !== undefined);

    const matchedTutors = await db
      .selectDistinct()
      .from(tutorTable)
      .where(
        inArray(
          tutorTable.id,
          db
            .select({ id: matchedTable.tutor_id })
            .from(matchedTable)
            .where(inArray(matchedTable.tutor_id, tutorIds))
            .groupBy(matchedTable.tutor_id)
        )
      );

    const matched_ids = await db
      .select({ id: matchedTable.tutor_id })
      .from(matchedTable);

    const matched_ids_arr = matched_ids
      .map((row) => row.id)
      .filter((id): id is string => id !== null);

    const unmatchedTutors = await db
      .selectDistinct()
      .from(tutorTable)
      .where(
        and(
          inArray(
            tutorTable.id,
            db
              .select({ id: unmatchedTable.tutor_id })
              .from(unmatchedTable)
              .where(inArray(unmatchedTable.tutor_id, tutorIds))
              .groupBy(unmatchedTable.tutor_id)
          ),
          notInArray(tutorTable.id, matched_ids_arr),
          eq(tutorTable.status, TUTOR_STATUS.ACTIVE)
        )
      );

    // paused tutors keep their unmatched rows, so they are listed here instead
    const pausedTutors = await db
      .select()
      .from(tutorTable)
      .where(
        and(
          inArray(tutorTable.id, tutorIds),
          eq(tutorTable.status, TUTOR_STATUS.PAUSED)
        )
      );

    const historyTutors = await db
      .selectDistinct()
      .from(tutorTable)
      .where(
        inArray(
          tutorTable.id,
          db
            .select({ id: historyTable.tutor_id })
            .from(historyTable)
            .where(inArray(historyTable.tutor_id, tutorIds))
            .groupBy(historyTable.tutor_id)
        )
      );

    res.send({
      matchedTutors: matchedTutors,
      unmatchedTutors: unmatchedTutors,
      historyTutors: historyTutors,
      pausedTutors: pausedTutors,
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

    // getting the unmatched tutors with the filtered ids. Paused tutors are
    // left out, which keeps them out of match suggestions, custom matches
    // and the Edit Pair tutor list (all of which read this endpoint).
    const unmatchedTutors = await db
      .select()
      .from(tutorTable)
      .innerJoin(unmatchedTable, eq(tutorTable.id, unmatchedTable.tutor_id))
      .where(
        and(
          inArray(tutorTable.id, tutorIds),
          eq(tutorTable.status, TUTOR_STATUS.ACTIVE)
        )
      );

      res.send({
        unmatchedTutors: unmatchedTutors.map((row: any) => ({
          tutor: row.tutor,
          unmatchedId: row.unmatched.id,
        })),
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

    if (tutor_id.length === 7 || tutor_id.length === 8) {
      // A paused tutor stays paused until unpaused; deleting them from here
      // would leave them in both the History and Paused tabs.
      if ((await getTutorStatus(pausePool, String(tutor_id))) === TUTOR_STATUS.PAUSED) {
        res.status(409).json({
          error: "This tutor is paused. Unpause them on the Tutor Database page before deleting them.",
        });
        return;
      }

      const query = await db
        .select()
        .from(unmatchedTable)
        .where(eq(unmatchedTable.tutor_id, tutor_id));

      if (query.length > 0) {
        await db
          .update(tutorTable)
          .set({ 
            history_date: new Date().toISOString().split("T")[0],
            priority: false,
           })
          .where(eq(tutorTable.id, tutor_id));

        await db.insert(historyTable).values(query[0]);

        await db
          .delete(unmatchedTable)
          .where(eq(unmatchedTable.tutor_id, tutor_id));

        res.json({ success: true, message: "Tutor moved" });
      } else {
        res.status(404).json({ error: "Tutor not found in unmatched table" });
      }
    } else {
      res.status(400).json({ error: "Invalid ID format" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error moving to history");
  }
};


export const unmatchedToMatched = async (req: Request, res: Response) => {
  const tutorId = tutorIdParam(req);
  if (!tutorId) {
    res.status(400).json({ error: "Invalid tutor id" });
    return;
  }
  // Paused tutors can't be matched. When the move below is implemented, it
  // should lock the tutor row and re-check status in the same transaction,
  // like approvePendingMatch does, so a pause can't slip in between.
  try {
    const status = await getTutorStatus(pausePool, tutorId);
    if (status === null) {
      res.status(404).json({ error: "Tutor not found" });
      return;
    }
    if (status === TUTOR_STATUS.PAUSED) {
      res.status(409).json({
        error: "This tutor is paused. Unpause them on the Tutor Database page before matching them.",
      });
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to move tutor to matched" });
    return;
  }

  // TODO: Implement logic
  console.error("not implemented yet");
};

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

export const permDeleteTutor = async (req: Request, res: Response) => {
  // console.log("in backend for perm delete");
  try {
    const tutor_id = req.params.id;
    await db.delete(historyTable).where(eq(historyTable.tutor_id, tutor_id));
    await db.delete(tutorTable).where(eq(tutorTable.id, tutor_id));
    res.status(200).json({ message: "Tutor permanently deleted" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error permanently deleting tutor", error: error });
  }
};

export const togglePriorityFlag = async (req: Request, res: Response) => {
  // console.log(req.body, "req.body");
  // console.log(req.params, "req.params");
  const tutor_id = req.params.id;
  try {
    const query = await db
      .select()
      .from(tutorTable)
      .where(eq(tutorTable.id, tutor_id));

    if (query.length > 0) {
      const currentPriority = query[0].priority;
      await db
        .update(tutorTable)
        .set({ priority: !currentPriority })
        .where(eq(tutorTable.id, tutor_id));
      // console.log(!currentPriority, "currentPriority");
      res.json({ priority: !currentPriority });
    } else {
      res.status(404).json({ message: "Tutor not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error toggling priority flag", error });
  }
};

/******* Pause / unpause a tutor *******
 *
 *  - a paused tutor stays in the database but cannot be matched and is
 *    left out of match suggestions
 *  - only unmatched tutors can be paused; a tutor with an active match
 *    gets a 409
 *  - unpausing puts the tutor back in the Unmatched tab
 ***************************************/
const sendPauseError = (res: Response, error: unknown, fallback: string) => {
  if (error instanceof TutorNotFound) {
    res.status(404).json({ error: error.message });
  } else if (error instanceof PauseConflict) {
    res.status(409).json({ error: error.message });
  } else {
    console.error(error);
    res.status(500).json({ error: fallback });
  }
};

export const pauseTutor = async (req: Request, res: Response) => {
  const tutorId = tutorIdParam(req);
  if (!tutorId) {
    res.status(400).json({ error: "Invalid tutor id" });
    return;
  }
  try {
    await pauseTutorService(pausePool, tutorId);
    res.json({ success: true, status: TUTOR_STATUS.PAUSED });
  } catch (error) {
    sendPauseError(res, error, "Failed to pause tutor");
  }
};

export const unpauseTutor = async (req: Request, res: Response) => {
  const tutorId = tutorIdParam(req);
  if (!tutorId) {
    res.status(400).json({ error: "Invalid tutor id" });
    return;
  }
  try {
    await unpauseTutorService(pausePool, tutorId);
    res.json({ success: true, status: TUTOR_STATUS.ACTIVE });
  } catch (error) {
    sendPauseError(res, error, "Failed to unpause tutor");
  }
};
