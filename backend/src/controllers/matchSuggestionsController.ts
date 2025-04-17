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
import { eq, and, or } from "drizzle-orm";
import { Request, Response } from "express";
import TutorMatcher from "../algorithm.js";

const db = drizzle(process.env.DATABASE_URL!);

export type tuteeBoxProps = {
  id: string;
  tutee_first_name: string;
  tutee_last_name: string;
  parent_email: string;
  subjects: string[];
  grade: string;
  special_needs: string;
  tutoring_mode: string;
};

type TutorObjectProps = {
  tutorId: string;
  tuteeId1: number;
  tuteeId2: number;
  tuteeId3: number;
};

/* returns all the tutor - tutee1-3 match suggestions */
export const getMatchSuggestions = async (req: Request, res: Response) => {
  try {
    console.log("Inside match suggestions endpoint");
    // query logic
    // NOTE: Algorithm implementation somewhere here

    // Step 1: Pull all unmatched tutees
    // Step 2: Pull all unmatched tutors
    const tutorMatcher = new TutorMatcher();
    await tutorMatcher.fetchData();
    // Step 3: For each tutor, call the algorithm on all the tutees to find the top 3
    let tutorObject = await tutorMatcher.findMatches();

    const matchResults = await Promise.all(
      tutorObject.map(async (match: TutorObjectProps) => {
        console.log("Tutee 1 ID IS: ", match.tuteeId1);
        const tutor_obj = await db
          .select({
            id: tutorTable.id,
            first_name: tutorTable.first_name,
            last_name: tutorTable.last_name,
            phone: tutorTable.phone,
            email: tutorTable.email,
            subject: tutorTable.subject_pref,
            grade_level_pref: tutorTable.grade_level_pref,
            disability_pref: tutorTable.disability_pref,
            tutoring_mode: tutorTable.tutoring_mode,
            notes: tutorTable.notes,
          })
          .from(tutorTable)
          .where(eq(tutorTable.id, match.tutorId));
        const tutee1_obj = await db
          .select({
            id: tuteeTable.id,
            first_name: tuteeTable.tutee_first_name,
            last_name: tuteeTable.tutee_last_name,
            email: tuteeTable.parent_email,
            grade: tuteeTable.grade,
            subjects: tuteeTable.subjects,
            special_needs: tuteeTable.special_needs,
            tutoring_mode: tuteeTable.tutoring_mode,
            notes: tuteeTable.notes,
          })
          .from(tuteeTable)
          .where(eq(tuteeTable.id, match.tuteeId1));
        const tutee2_obj = await db
          .select({
            id: tuteeTable.id,
            first_name: tuteeTable.tutee_first_name,
            last_name: tuteeTable.tutee_last_name,
            email: tuteeTable.parent_email,
            grade: tuteeTable.grade,
            subjects: tuteeTable.subjects,
            special_needs: tuteeTable.special_needs,
            tutoring_mode: tuteeTable.tutoring_mode,
            notes: tuteeTable.notes,
          })
          .from(tuteeTable)
          .where(eq(tuteeTable.id, match.tuteeId2));
        const tutee3_obj = await db
          .select({
            id: tuteeTable.id,
            first_name: tuteeTable.tutee_first_name,
            last_name: tuteeTable.tutee_last_name,
            email: tuteeTable.parent_email,
            grade: tuteeTable.grade,
            subjects: tuteeTable.subjects,
            special_needs: tuteeTable.special_needs,
            tutoring_mode: tuteeTable.tutoring_mode,
            notes: tuteeTable.notes,
          })
          .from(tuteeTable)
          .where(eq(tuteeTable.id, match.tuteeId3));

        let tutor = tutor_obj[0] || null;
        let tutee1 = tutee1_obj[0] || null;
        let tutee2 = tutee2_obj[0] || null;
        let tutee3 = tutee3_obj[0] || null;

        return { tutor, tutee1, tutee2, tutee3 };
      })
    );

    // console.log("these are the tutees: ", tutees);
    // console.log("these are the tutors: ", matchResults);

    res.send({
      matchSuggestions: matchResults,
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
      });
      await db.insert(matchedTable).values({
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

      // Caitlyn Valentina TODO
      const [deleteID] = await db
        .select({id: unmatchedTable.id})
        .from(unmatchedTable)
        .where(
          eq(unmatchedTable.tutor_id, tutorId),
        ).limit(1);

        await db.delete(unmatchedTable).where(eq(unmatchedTable.id, deleteID.id));
        await db.delete(unmatchedTable).where(eq(unmatchedTable.tutee_id, selectedTuteeId));
  

        //console.log(deleteID.id);

      res.status(200).json({ success: true });
    } else {
      throw new Error("Invalid Match");
    }
  } catch (error: any) {
    console.error("Error in approveMatch:", error);
    res.status(500).json({ error: error.message });
  }
};