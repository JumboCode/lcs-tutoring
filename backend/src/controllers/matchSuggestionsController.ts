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
import { eq, and } from "drizzle-orm";
import { Request, Response } from "express";
import TutorMatcher from "../algorithm";

const db = drizzle(process.env.DATABASE_URL!);


/* returns all the tutor - tutee1-3 match suggestions */
export const getMatchSuggestions = async (req: Request, res: Response) => {
  try {
    console.log("Inside match suggestions endpoint");
    // query logic
    // NOTE: Algorithm implementation somewhere here

    // Step 1: Pull all unmatched tutees
    // Step 2: Pull all unmatched tutors
    //      Form: {tutor, tutee1, tutee2, tutee3}
    // Step 3: Run algorithm with all unmatched tutees and tutors
    // Step 4: res.send() what the algorithm spits back out

    /*
     { tuteeId: 9, tutorId: '1000003', matchScore: 0.6000000000000001 },
    { tuteeId: 11, tutorId: '1000003', matchScore: 0.6000000000000001 },
    {

    {tutorId: '1000003', tuteeId1: 9, tuteeId2: 11, tuteeId3: NULL}
    */
    const tutorMatcher: any = new TutorMatcher();
    await tutorMatcher.fetchData();
    await tutorMatcher.findMatches();

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
        // tutee1: {
        //   id: tuteeTable.id,
        //   tutee_first_name: tuteeTable.tutee_first_name,
        //   tutee_last_name: tuteeTable.tutee_last_name,
        //   parent_email: tuteeTable.parent_email,
        //   grade: tuteeTable.grade,
        //   subjects: tuteeTable.subjects,
        //   special_needs: tuteeTable.special_needs,
        //   tutoring_mode: tuteeTable.tutoring_mode
        // },
        // tutee2: {
        //   id: tuteeTable.id,
        //   tutee_first_name: tuteeTable.tutee_first_name,
        //   tutee_last_name: tuteeTable.tutee_last_name,
        //   parent_email: tuteeTable.parent_email,
        //   grade: tuteeTable.grade,
        //   subjects: tuteeTable.subjects,
        //   special_needs: tuteeTable.special_needs,
        //   tutoring_mode: tuteeTable.tutoring_mode
        // },
        // tutee3: {
        //   id: tuteeTable.id,
        //   tutee_first_name: tuteeTable.tutee_first_name,
        //   tutee_last_name: tuteeTable.tutee_last_name,
        //   parent_email: tuteeTable.parent_email,
        //   grade: tuteeTable.grade,
        //   subjects: tuteeTable.subjects,
        //   special_needs: tuteeTable.special_needs,
        //   tutoring_mode: tuteeTable.tutoring_mode
        // }
      })
      .from(unmatchedTable)
      // .where(and(tutee1.id))
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
        pair_date: new Date().toLocaleDateString("en-CA", {
          timeZone: "America/New_York",
        }),
      });

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