import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { matchedTable, tuteeTable, tutorTable, unmatchedTable } from './db/schema';
import { or, arrayContains, and , eq } from 'drizzle-orm';
import express, { Express, Request, Response } from "express";
import cors from "cors";

const db = drizzle(process.env.DATABASE_URL!);

const app: Express = express();
const port = 3000;
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

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
async function filterTutors(gradeLevels?: number[], subject_pref?: string[], disabilityPref?: boolean, tutoringMode?: string) {
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

    if (disabilityPref != undefined) {
        conditions.push(or(eq(tutorTable.disability_pref, disabilityPref)));
    }

    if (tutoringMode != undefined) {
        conditions.push(or(eq(tutorTable.tutoring_mode, tutoringMode)));
    }
    
    if (conditions.length > 0) {
      query.where(and(...conditions));
    }

    const tutors = await query;
    return tutors;
}

// filterTutors([10], ["Writing", "Algebra"], false, "In-Person").then(tutors => console.log(tutors));
// moveToMatched("1000002");

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
async function moveToMatched(id: string) {
    if (id.length == 7 || id.length == 8) {
        const query = await db.select().from(unmatchedTable).where(eq(unmatchedTable.id, id)); //returns an array with only one element
        const remain = query.length - 1;
        if (query.length > 0) {
            await db.insert(matchedTable).values(query[0]); //inserts only one row into matchedTable
            
            await db.delete(unmatchedTable).where(eq(unmatchedTable.id, id));
    
            for (let i = 0; i < query.length - 1; i++){ //adding rows back in
                await db.insert(unmatchedTable).values(query[0]);
            }
        }
        else {
            throw new Error("ID not found in unmatched table");
        }
    }
    else {
        throw new Error("Invalid ID");
    }
}

// moveToMatched("1000002");

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
async function moveToUnmatched(id: string) {
    if (id.length == 7) {
        const query = await db.select().from(matchedTable).where(eq(matchedTable.id, id));
        console.log(query);

        if(!query) {
            throw new Error('${id} does not exist in matched table');
        }

        await db.insert(unmatchedTable).values(query);
        await db.delete(matchedTable).where(eq(matchedTable.id, id));
    }
}

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
async function createMatch(tutor_id: string, tutee_id: string) {}