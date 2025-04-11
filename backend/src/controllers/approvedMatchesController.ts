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
  historyTable,
} from "../db/schema";
import { or, arrayContains, inArray, and, eq } from "drizzle-orm";
import { Request, Response } from "express";

const db = drizzle(process.env.DATABASE_URL!);

import Mailjet from 'node-mailjet';

const mailjetClient = new Mailjet.Client({
  apiKey: (process.env.MAILJETAPIKEY!),
  apiSecret: (process.env.MAILJETSECRETKEY!),
});

export const deletePair = async (req: Request, res: Response) => {
  try {
    const match_id = Number(req.params.id);

    const match = await db
      .select()
      .from(approvedMatchesTable)
      .where(eq(approvedMatchesTable.id, match_id));
    if (!match) {
      res.status(404).json("Match not found");
    }
    console.log("here");
    await db
      .update(approvedMatchesTable)
      .set({ active: false, inactive_date: new Date().toISOString().split("T")[0] })
      .where(eq(approvedMatchesTable.id, match_id));
    console.log("Match moved to inactive");
    res.status(200).json("Match moved to inactive");

    const tutor_id = match[0].tutor_id;
    const tutee_id = match[0].tutee_id;

    await db.insert(historyTable).values({
      tutor_id: tutor_id,
    });

    const [deleteID] = await db
    .select({id: matchedTable.id})
    .from(matchedTable)
    .where(
      eq(matchedTable.tutor_id, tutor_id),
    ).limit(1);

    await db.delete(matchedTable).where(eq(matchedTable.id, deleteID.id));

    // await db.delete(matchedTable).where(eq(matchedTable.tutor_id, tutor_id));

    await db.update(tutorTable)
      .set({ history_date: new Date().toISOString().split("T")[0], })
      .where(eq(tutorTable.id, tutor_id));

    await db.insert(historyTable).values({
      tutee_id: tutee_id,
    });


      

    await db.delete(matchedTable).where(eq(matchedTable.tutee_id, tutee_id));

    await db.update(tuteeTable)
      .set({ history_date: new Date().toISOString().split("T")[0], })
      .where(eq(tuteeTable.id, tutee_id));

  } catch (error) {
    console.error(error);
    res.status(500).json("Error updating flag status");
  }

};

/* returns all the approved matches */
export const getApprovedMatches = async (req: Request, res: Response) => {
  try {
    console.log("Inside approved matches endpoint");

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

    console.log("grades:", grades);
    console.log("subjects:", subjects);
    console.log("tutoring mode:", tutoringMode);
    console.log("disability:", disability_pref);
    console.log("Inside tutees endpoint");

    const filteredMatches = await filterMatches(
      grades,
      subjects,
      disability_pref,
      tutoringMode?.toString(),
    );

    // console.log(filteredMatches);

    // getting all ids of the filtered matches
    const matchIds = filteredMatches
      .map((match: any) => match.matchId)
      .filter((id: any) => id !== undefined);

    // query to get all active matches
    const active_matches = await db
      .select({
        matchId: approvedMatchesTable.id,
        flagged: approvedMatchesTable.flagged,
        sent_email: approvedMatchesTable.sent_email,
        pair_date: approvedMatchesTable.pair_date,
        inactive_date: approvedMatchesTable.inactive_date,
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
          special_needs: tuteeTable.special_needs,
          parent_first_name: tuteeTable.parent_first_name,
          parent_last_name: tuteeTable.parent_last_name,
          parent_phone: tuteeTable.parent_phone,
        },
      })
      .from(approvedMatchesTable)
      .innerJoin(tutorTable, eq(approvedMatchesTable.tutor_id, tutorTable.id))
      .innerJoin(tuteeTable, eq(approvedMatchesTable.tutee_id, tuteeTable.id))
      .where(and(eq(approvedMatchesTable.active, true), inArray(approvedMatchesTable.id, matchIds)));

    // query to get all the inactive matches
    const inactive_matches = await db
      .select({
        matchId: approvedMatchesTable.id,
        flagged: approvedMatchesTable.flagged,
        sent_email: approvedMatchesTable.sent_email,
        pair_date: approvedMatchesTable.pair_date,
        inactive_date: approvedMatchesTable.inactive_date,
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
          special_needs: tuteeTable.special_needs,
          parent_first_name: tuteeTable.parent_first_name,
          parent_last_name: tuteeTable.parent_last_name,
        },
      })
      .from(approvedMatchesTable)
      .innerJoin(tutorTable, eq(approvedMatchesTable.tutor_id, tutorTable.id))
      .innerJoin(tuteeTable, eq(approvedMatchesTable.tutee_id, tuteeTable.id))
      .where(and(eq(approvedMatchesTable.active, false), inArray(approvedMatchesTable.id, matchIds)));

    res.send({
      activeApprovedMatches: active_matches,
      inactiveApprovedMatches: inactive_matches,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching approved matches");
  }
};

/**** Filter Matches by grade levels and subjects ****
 *
 * Example input: filterMatches([9, 10], undefined)
 *  - Should return all tutors that have selected 9th or
 *    10th graders in their grade preferences
 *
 * Pass in "undefined" to not filter by something
 *
 * You can console.log all the tutors that the query returns
 * to verify a correct output
 *********************************************************/
async function filterMatches(
  grades?: number[],
  subjects?: string[],
  disabilityPref?: boolean,
  tutoringMode?: string
) {
  const query = db.select({
    matchId: approvedMatchesTable.id,
    tutee: {
      grade: tuteeTable.grade,
      subjects: tuteeTable.subjects,
      tutoring_mode: tuteeTable.tutoring_mode,
      has_special_needs: tuteeTable.has_special_needs
    }
  }).from(approvedMatchesTable)
    .innerJoin(tuteeTable, eq(approvedMatchesTable.tutee_id, tuteeTable.id));

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

  const matches = await query;

  // console.log("Filtered matches:", matches);

  return matches;
}

// backend/src/index.ts
export const flagApprovedMatch = async (req: Request, res: Response) => {
  console.log("Flagging approved match");
  console.log(req.body);
  const id = parseInt(req.body.matchId);
  console.log("Match id: ", id);
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
      .set({ active: false, inactive_date: new Date().toISOString().split("T")[0] })
      .where(eq(approvedMatchesTable.id, Number(match_id)));

    res.json({ success: true, message: "Pair unmatched" });
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

    const row = query[0];
    await db.insert(unmatchedTable).values({
      tutor_id: row.tutor_id,
    });

        const [deleteID] = await db
        .select({id: matchedTable.id})
        .from(matchedTable)
        .where(
        eq(matchedTable.tutor_id, tutor_id),
        ).limit(1);

    await db.delete(matchedTable).where(eq(matchedTable.id, deleteID.id));
    
    
    // await db.delete(matchedTable).where(eq(matchedTable.tutor_id, tutor_id));
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

  const row = query[0];
  await db.insert(unmatchedTable).values({
    tutee_id: row.tutee_id,
  });

  await db.delete(matchedTable).where(eq(matchedTable.tutee_id, tutee_id));
}

export const emailPair = async (req: Request, res: Response) => {
  try {
    const tutorName = req.body.tutorName;
    const tutorEmail = req.body.tutorEmail;
    
    const tuteeName = req.body.tuteeName;
    const tuteeParentName = req.body.tuteeParentName;
    const tuteeParentEmail = req.body.tuteeParentEmail;
    const tuteeParentPhone = req.body.tuteeParentPhone;
    const tuteeGrade = req.body.tuteeGrade;
    const tuteeSubjects = req.body.tuteeSubjects;

    const tuteeMessage = req.body.tuteeMessage.replaceAll("TUTEE_NAME", `${tuteeName}`).replaceAll("TUTEE_PARENT_NAME", `${tuteeParentName}`);
    const tutorMessage = req.body.tutorMessage.replaceAll("TUTOR_NAME", `${tutorName}`).replaceAll("TUTEE_NAME", `${tuteeName}`).replaceAll("TUTEE_PARENT_NAME", `${tuteeParentName}`).replaceAll("TUTEE_GRADE", `${tuteeGrade == "0"
      ? "Kindergarten"
      : tuteeGrade == "1"
      ? "1st"
      : tuteeGrade == "2"
      ? "2nd"
      : tuteeGrade == "3"
      ? "3rd"
      : tuteeGrade + "th"}`).replaceAll("TUTEE_SUBJECTS", `${tuteeSubjects.join(", ")}`).replaceAll("TUTEE_PARENT_EMAIL", `${tuteeParentEmail}`).replaceAll("TUTEE_PARENT_PHONE", `${tuteeParentPhone}`);

    const matchId = req.body.matchId;

    const request = mailjetClient.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: (process.env.SENDEREMAIL!),
            Name: 'LCSTutoring',
          },
          To: [
            {
              Email: tuteeParentEmail,
              Name: tuteeParentName,
            },
          ],
          Subject: 'LCSTutoring: New Tutor Match Confirmation',
          TextPart: `Dear ${tuteeParentName},
    
    We are pleased to inform you that ${tuteeName} has been matched with a tutor. Your child's tutor will reach out to you directly within the next 48 hours to schedule your first session.
    
    If you do not hear from the tutor within 48 hours, please let us know and we will follow up.
    
    If you have any questions or concerns, please don't hesitate to contact us.
    
    Sincerely,
    The LCSTutoring Team`,
          HTMLPart: tuteeMessage,
        },
        {
          From: {
            Email: (process.env.SENDEREMAIL!),
            Name: 'LCSTutoring',
          },
          To: [
            {
              Email: tutorEmail,
              Name: tutorName,
            },
          ],
          Subject: 'LCSTutoring: New Student Match Confirmation',
          TextPart: `Dear ${tutorName},
    
    We are pleased to inform you that you have been matched with a new student, ${tuteeName}. Please reach out to the student's parent to schedule your first tutoring session.
    
    Student Details:
    Name: ${tuteeName}
    Grade: ${tuteeGrade == "0"
      ? "Kindergarten"
      : tuteeGrade == "1"
      ? "1st"
      : tuteeGrade == "2"
      ? "2nd"
      : tuteeGrade == "3"
      ? "3rd"
      : tuteeGrade + "th"}
    Subjects: ${tuteeSubjects.join(", ")}
    
    Parent Details:
    Name: ${tuteeParentName}
    Email: ${tuteeParentEmail}
    Phone: ${tuteeParentPhone}
    
    IMPORTANT NEXT STEPS:
    1. Contact the parent within the next 48 hours to introduce yourself and arrange your first session.
    2. After scheduling your session, please email us with:
       - The scheduled date and time of your first session
       - The modality (virtual or in-person)
    
    TRACKING YOUR SERVICE HOURS:
    Remember to log all your tutoring hours in Tufts Civic Impact. This is important for:
    - Keeping track of your community service
    - Providing verification for your service commitments
    - Helping us maintain program statistics
    
    To log hours:
    1. Log in to your Tufts Civic Impact account
    2. Navigate to the "Log Hours" section
    3. Select "LCSTutoring" as your project
    4. Enter the date, duration, and a brief description of your session
    
    If you have any questions or need assistance, please don't hesitate to contact us.
    
    Sincerely,
    The LCSTutoring Team`,
          HTMLPart: tutorMessage,
        },
      ],
    })

    const result = await request;
    
    await db.update(approvedMatchesTable)
      .set({ sent_email: true })
      .where(eq(approvedMatchesTable.id, matchId));

    console.log("Email sent:", result.body);
    res.status(200).json({ message: "Emails sent successfully" });

  } catch (err: any) {
    console.error("Email sending error:", err);
    res.status(500).json({ message: "Failed to send emails", error: err.message || err });
  }
};
