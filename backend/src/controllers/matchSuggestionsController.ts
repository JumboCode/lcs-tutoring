/***********************************************
 * This file is for the routes and function imps involving match suggestions
 ***********************************************/

import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import {
  tuteeTable,
  tutorTable,
} from "../db/schema";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import { Pool } from "pg";
import { approvePendingMatch, ApprovalConflict } from "../services/approveMatch";
import TutorMatcher from "../algorithm.js";

const approvalPool = new Pool({ connectionString: process.env.DATABASE_URL });

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
  unmatchedTutorId: number;
};

/* returns all the tutor - tutee1-3 match suggestions */
export const getMatchSuggestions = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    // console.log("AUTH HEADER IS: ", authHeader);
    // Step 1: Pull all unmatched tutees
    // Step 2: Pull all unmatched tutors
    const tutorMatcher = new TutorMatcher();
    await tutorMatcher.fetchData(authHeader!);
    // Step 3: For each tutor, call the algorithm on all the tutees to find the top 3
    let tutorObject = await tutorMatcher.findMatches();

    const matchResults = await Promise.all(
      tutorObject.map(async (match: TutorObjectProps) => {
        // console.log("MATCH OBJECT IS: ", match);
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
            priority: tutorTable.priority,
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
            priority: tuteeTable.priority,
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
            priority: tuteeTable.priority,
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
            priority: tuteeTable.priority,
          })
          .from(tuteeTable)
          .where(eq(tuteeTable.id, match.tuteeId3));

        let tutor = tutor_obj[0] || null;
        let tutee1 = tutee1_obj[0] || null;
        let tutee2 = tutee2_obj[0] || null;
        let tutee3 = tutee3_obj[0] || null;

        return { tutor, tutee1, tutee2, tutee3, unmatchedTutorId: match.unmatchedTutorId };
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
  const tutorId = req.body.tutorId;
  const selectedTuteeId = Number(req.body.selectedTuteeId);
  const unmatchedTutorId = Number(req.body.unmatchedTutorId);
  if (typeof tutorId !== "string" || !tutorId.trim() || tutorId.length > 7 ||
      !Number.isSafeInteger(selectedTuteeId) || selectedTuteeId <= 0 ||
      !Number.isSafeInteger(unmatchedTutorId) || unmatchedTutorId <= 0) {
    res.status(400).json({ error: "Invalid match" });
    return;
  }
  try {
    await approvePendingMatch(approvalPool, { tutorId, selectedTuteeId, unmatchedTutorId });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error in approveMatch:", error);
    res.status(error instanceof ApprovalConflict ? 409 : 500).json({
      error: error instanceof ApprovalConflict ? error.message : "Failed to approve match",
    });
  }
};
