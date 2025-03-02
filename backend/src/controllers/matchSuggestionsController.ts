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

export const approveMatch = async (req: Request, res: Response) => {
  console.log("IN APPROVE MATCH");
  try {
    const { tutorId, selectedTuteeId } = req.body;
    
    if (tutorId > 0 && selectedTuteeId > 0) {
      await db.insert(matchedTable).values({
        tutee_id: selectedTuteeId,
        tutor_id: tutorId,
      });
      console.log("Are we inserting into matched table??");

      await db.insert(approvedMatchesTable).values({
        tutee_id: selectedTuteeId,
        tutor_id: tutorId,
      });

      await db
        .update(approvedMatchesTable)
        .set({
          date: new Date().toLocaleDateString("en-CA", {
            timeZone: "America/New_York",
          }),
        })
        .where(eq(approvedMatchesTable.tutee_id, selectedTuteeId));

      await db
        .delete(unmatchedTable)
        .where(
          eq(unmatchedTable.tutor_id, tutorId) ||
            eq(unmatchedTable.tutee_id, selectedTuteeId)
        );

      res.status(200).json({ success: true });
    } else {
      throw new Error("Invalid Match");
    }
  } catch (error: any) {
    console.error("Error in approveMatch:", error);
    res.status(500).json({ error: error.message });
  }
};


/*
if (tutee_id > 0) {
    const query = await db
      .select()
      .from(matchedTable)
      .where(eq(matchedTable.tutee_id, tutee_id)); //returns an array with only one element

    if (query.length > 0) {
      await db.insert(historyTable).values(query[0]); //inserts only one row into matchedTable

      await db.delete(matchedTable).where(eq(matchedTable.tutee_id, tutee_id));

    } else {
      throw new Error("ID not found in matched table");
    }
  } else {
    throw new Error("Invalid ID");
  }*/