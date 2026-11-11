/***********************************************
 * This file is for the routes and function imps involving match suggestions
 ***********************************************/

import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import {
  tuteeTable,
  tutorTable,
} from "../db/schema";
import { and, eq } from "drizzle-orm";
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
    const { tutorId, selectedTuteeId, unmatchedTutorId } = req.body;
    // console.log("TUTOR ID IS: ", tutorId);
    // console.log("SELECTED TUTEE ID IS: ", selectedTuteeId);
    // console.log("UNMATCHED TUTOR ID IS: ", unmatchedTutorId);

    // Reject bad input before any write, so the admin sees why nothing happened
    if (!tutorId || !(Number(selectedTuteeId) > 0) || !(Number(unmatchedTutorId) > 0)) {
      return res.status(400).json({ error: "Invalid match: a tutor and a tutee are required" });
    }

    // A tutor can have several tutees, but a tutee only has one active match. This stops
    // repeat clicks and stale cards from creating duplicate approved matches.
    const activeMatches = await db
      .select({ id: approvedMatchesTable.id })
      .from(approvedMatchesTable)
      .where(
        and(
          eq(approvedMatchesTable.tutee_id, selectedTuteeId),
          eq(approvedMatchesTable.active, true)
        )
      );
    if (activeMatches.length > 0) {
      return res.status(409).json({ error: "This tutee already has an active approved match" });
    }

    // Each unmatched row is one open slot for this tutor (see num_tutees in the tutor form).
    // Without this check, a stale id would approve the match while deleting no slot,
    // leaving the pairing available.
    const openSlots = await db
      .select({ id: unmatchedTable.id })
      .from(unmatchedTable)
      .where(
        and(
          eq(unmatchedTable.id, unmatchedTutorId),
          eq(unmatchedTable.tutor_id, tutorId)
        )
      );
    if (openSlots.length === 0) {
      return res.status(409).json({ error: "This tutor is no longer available for this match. Please refresh the page." });
    }

    // db.batch runs these as one transaction, so a failure partway through rolls back
    // every write instead of leaving the pair half approved
    await db.batch([
      db.insert(matchedTable).values({
        tutee_id: selectedTuteeId,
      }),
      db.insert(matchedTable).values({
        tutor_id: tutorId,
      }),

      db.insert(approvedMatchesTable).values({
        tutee_id: selectedTuteeId,
        tutor_id: tutorId,
        pair_date: new Date().toLocaleDateString("en-CA", {
          timeZone: "America/New_York",
        }),
      }),

      db
        .update(tutorTable)
        .set({ priority: false })
        .where(eq(tutorTable.id, tutorId)),

      db
        .update(tuteeTable)
        .set({ priority: false })
        .where(eq(tuteeTable.id, selectedTuteeId)),

      // Delete only this slot by row id, so a tutor with more open slots stays available
      db.delete(unmatchedTable).where(eq(unmatchedTable.id, unmatchedTutorId)),
      db.delete(unmatchedTable).where(eq(unmatchedTable.tutee_id, selectedTuteeId)),
    ]);

    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error("Error in approveMatch:", error);
    res.status(error instanceof ApprovalConflict ? 409 : 500).json({
      error: error instanceof ApprovalConflict ? error.message : "Failed to approve match",
    });
  }
};
