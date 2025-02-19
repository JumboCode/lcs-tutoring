/***********************************************
 * This file is for the routes and function imps involving approved matches
 ***********************************************/

import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import {
  tuteeTable,
  tutorTable,
  approvedMatchesTable,
  matchedTable,
  unmatchedTable,
} from "../db/schema";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import { Resend } from "resend";

const db = drizzle(process.env.DATABASE_URL!);

const resend = new Resend(process.env.RESENDAPIKEY!);

/* returns all the approved matches */
export const getApprovedMatches = async (req: Request, res: Response) => {
  try {
    console.log("Inside approved matches endpoint");

    // query to get all active matches
    const active_matches = await db
      .select({
        // TODO: do we need matchID and flagged?
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

      // query to get all the inactive matches
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
};

// backend/src/index.ts
export const flagApprovedMatch = async (req: Request, res: Response) => {
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
};

/* Given a match id, moves the associated match to inactive and 
 * the tutor and tutee to unmatched */
export const unmatchPair = async (req: Request, res: Response) => {
  try {
    console.log("inside unmatch pair");
    const match_id = req.params.id;
  
    // query to get the approved match
    const query = await db
        .select()
        .from(approvedMatchesTable)
        .where(eq(approvedMatchesTable.id, Number(match_id)));
    
    moveTutorToUnmatched(query[0].tutor_id);
    moveTuteeToUnmatched(query[0].tutee_id);
    
    // Move the pair to inactive in Approved Matches Table
    await db
        .update(approvedMatchesTable)
        .set({ active: false })
        .where(eq(approvedMatchesTable.id, Number(match_id)));
  } catch (error) {
    console.error(error);
    res.status(500).send("Error moving to inactive");
  }
};

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
      throw new Error("Tutor id does not exist in matched table");
    }

    await db
      .insert(unmatchedTable)
      .values(query)
      .onConflictDoNothing(); 
    await db.delete(matchedTable).where(eq(matchedTable.tutor_id, tutor_id));
  }
}

async function moveTuteeToUnmatched(tutee_id: number) {
  const query = await db
    .select()
    .from(matchedTable)
    .where(eq(matchedTable.tutee_id, tutee_id));
  console.log(query);

  if (!query) {
    throw new Error("Tutee id does not exist in matched table");
  }

  await db
    .insert(unmatchedTable)
    .values(query)
    .onConflictDoNothing(); 

  await db.delete(matchedTable).where(eq(matchedTable.tutee_id, tutee_id));
}

export const emailPair = async (req: Request, res: Response) => {
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
};