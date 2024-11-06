import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { tutorTable } from './db/schema';
import { eq, or, arrayContains, and } from 'drizzle-orm';

const db = drizzle(process.env.DATABASE_URL!);

/* Filter Tutors by their grade levels
 * 
 * Example input: filterTutors([9, 10])
 *     Should return all tutors that have selected 9th or
 *     10th graders in their grade preferences
 * 
 * You can console.log all the tutors that the query returns to verify
 * a correct output
 */


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

    if (conditions.length > 0) {
        query.where(and(...conditions));
    }

    const tutors = await query;
    console.log(tutors);
}

async function main(subject_pref?: string[]) {
    const query = db.select().from(tutorTable);

    if (subject_pref) {
        const conditions = subject_pref.map(subject => arrayContains(tutorTable.subject_pref, [subject]));
        query.where(or(...(conditions)));
    }

    const tutors = await query;
    console.log(tutors);
}

filterTutors(undefined, []);