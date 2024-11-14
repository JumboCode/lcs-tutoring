import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { tutorTable, unmatchedTable } from './db/schema';
import { or, arrayContains, and } from 'drizzle-orm';
import { approvedMatchedTable } from './db/schema';

import { eq } from 'drizzle-orm';

const db = drizzle(process.env.DATABASE_URL!);

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
async function filterTutors(gradeLevels?: number[], subject_pref?: string[]) {
    const query = db.select().from(tutorTable);

    const conditions: any[] = [];

    if(subject_pref && subject_pref.length > 0){
        const condition_subject = subject_pref.map(subject => arrayContains(tutorTable.subject_pref, [subject]));
        conditions.push(or(...condition_subject));
    }

    if (gradeLevels && gradeLevels.length > 0) {
        const condition_grade = gradeLevels.map(grade => arrayContains(tutorTable.grade_level_pref, [grade]));
        conditions.push(or(...condition_grade));
    }

    /* TODO: implement the rest of the filters (tutoring mode and disability preference) */

    if (conditions.length > 0) {
      query.where(and(...conditions));
    }

    const tutors = await query;
    return tutors;
}

filterTutors(undefined, ["Statistics"]).then(tutors => console.log(tutors));


/******* Move a given tutor/tutee from unmatched to matched *******
 * 
 *  - given a tutor or tutee's id, move them from the unmatched table to the
 *    matched table
 * 
 *  - throw an error if they don't exist in the unmatched table
 * 
 *  - it is ok if the tables have duplicate ids, you just have to move 1.
 * 
 ******************************************************************/
async function moveToMatched(id: string) {}

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
async function moveToUnmatched(id: string) {}

/************** Make a match given tutor and tutee ids ***************
 * 
 *  - Given a tutor id and a tutee id, find the ids in the tutor and tutee 
 *    unmatched tables and move them to matched
 * 
 *  - Create a new row in the approved_matched table that contains the
 *    tutor and tutee ids
 * 
 *  - Throw an error if either the tutor or tutee don't exist in the unmatched
 *    table
 */
async function createMatch(tutor_id: string, tutee_id: string)
{
    // Check if both exist in unmatched table first
    const unmatchedTutor = await db
        .select()
        .from(unmatchedTable)
        .where(eq(unmatchedTable.id, tutor_id))
        .limit(1);

    const unmatchedTutee = await db
        .select()
        .from(unmatchedTable)
        .where(eq(unmatchedTable.id, tutee_id))
        .limit(1);

    // Throw error if either doesn't exist in unmatched table
    if (unmatchedTutor.length === 0) {
        throw new Error(`Tutor with ID ${tutor_id} not found in unmatched table`);
    }
    if (unmatchedTutee.length === 0) {
        throw new Error(`Tutee with ID ${tutee_id} not found in unmatched table`);
    }

    // Start a transaction for all operations
    return await db.transaction(async (tx) => {
        // Use moveToMatched for both tutor and tutee
        await moveToMatched(tutor_id);
        await moveToMatched(tutee_id);

        // Create new row in approved_matches table
        await tx
            .insert(approvedMatchedTable)
            .values({
                tutor_id: tutor_id,
                tutee_id: tutee_id
            });
    });
}

