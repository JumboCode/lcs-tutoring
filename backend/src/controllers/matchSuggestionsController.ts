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
import { alias } from "drizzle-orm/pg-core";
import { Request, Response } from "express";
import TutorMatcher from "../algorithm.js";

const db = drizzle(process.env.DATABASE_URL!);

// type tuteeBoxProps = {
//   id: string;
//   date: string;
//   history_date: string | null;
//   tutee_first_name: string;
//   tutee_last_name: string;
//   parent_email: string;
//   subjects: string[];
//   grade: string;
//   special_needs: string;
//   gender: string;
//   tutoring_mode: string;
//   parent_first_name: string;
//   parent_last_name: string;
//   parent_phone: string;
// };

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

type tutorBoxProps = {
  id: string;
  date: string;
  first_name: string;
  last_name: string;
  pronouns: string;
  major: string;
  year_grad: string;
  phone: string;
  email: string;
  grade_level_pref: string[];
  disability_pref: boolean;
  subject_pref: string[];
  tutoring_mode: string;
  num_tutees: number;
};

type AlgoMatch = {
  tutor: tutorBoxProps
  tutee1: tuteeBoxProps
  tutee2: tuteeBoxProps
  tutee3: tuteeBoxProps
}

type TutorObjectProps = {
  tutorId: string,
  tuteeId1: number,
  tuteeId2: number,
  tuteeId3: number
}


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
              tutoring_mode: tutorTable.tutoring_mode})
          .from(tutorTable)
          .where(eq(tutorTable.id, match.tutorId));
        const tutee1_obj = await db
          .select({
              id: tuteeTable.id,
              first_name: tuteeTable.tutee_first_name,
              last_name: tuteeTable.tutee_last_name,
              parent_email: tuteeTable.parent_email,
              grade: tuteeTable.grade,
              subjects: tuteeTable.subjects,
              special_needs: tuteeTable.special_needs,
              tutoring_mode: tuteeTable.tutoring_mode,
            })
          .from(tuteeTable)
          .where(eq(tuteeTable.id, match.tuteeId1));
        const tutee2_obj = await db
          .select({
              id: tuteeTable.id,
              first_name: tuteeTable.tutee_first_name,
              last_name: tuteeTable.tutee_last_name,
              parent_email: tuteeTable.parent_email,
              grade: tuteeTable.grade,
              subjects: tuteeTable.subjects,
              special_needs: tuteeTable.special_needs,
              tutoring_mode: tuteeTable.tutoring_mode,
            })
          .from(tuteeTable)
          .where(eq(tuteeTable.id, match.tuteeId2));
        const tutee3_obj = await db
          .select({
              id: tuteeTable.id,
              first_name: tuteeTable.tutee_first_name,
              last_name: tuteeTable.tutee_last_name,
              parent_email: tuteeTable.parent_email,
              grade: tuteeTable.grade,
              subjects: tuteeTable.subjects,
              special_needs: tuteeTable.special_needs,
              tutoring_mode: tuteeTable.tutoring_mode,
          })
          .from(tuteeTable)
          .where(eq(tuteeTable.id, match.tuteeId3));

          let tutor = tutor_obj[0] || null;
          let tutee1 = tutee1_obj[0] || null;
          let tutee2 = tutee2_obj[0] || null;
          let tutee3 = tutee3_obj[0] || null;

        return {tutor, tutee1, tutee2, tutee3}
      })
    );
      
    // console.log("these are the tutees: ", tutees);
    console.log("these are the tutors: ", matchResults);


    res.send({
      matchSuggestions: matchResults
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