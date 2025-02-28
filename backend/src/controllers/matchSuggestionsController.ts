/***********************************************
 * This file is for the routes and function imps involving match suggestions
 ***********************************************/

import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import {
  tuteeTable,
  tutorTable,
  unmatchedTable,
  matchedTable,
  approvedMatchesTable,
} from "../db/schema";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

const db = drizzle(process.env.DATABASE_URL!);


/* returns all the tutor - tutee1-3 match suggestions */
export const getMatchSuggestions = async (req: Request, res: Response) => {
  try {
    console.log("Inside match suggestions endpoint");
    // query logic
    // NOTE: Algorithm implementation somewhere here

    // Step 1: Pull all unmatched tutees
    // Step 2: Pull all unmatched tutors
    // Step 3: For each tutor, call the algorithm on all the tutees to find the top 3
    // Step 4: Pass in all of the {tutor, tutee1, tutee2, tutee3} suggestions into the res.send

    const matches = await db
      .select({
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
};