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

    if (subject_pref && gradeLevels) {
        const condition_subject = subject_pref.map(subject => arrayContains(tutorTable.subject_pref, [subject]));
        const condition_grade = gradeLevels.map(grade => arrayContains(tutorTable.grade_level_pref, [grade]));
        query.where(and(or(...(condition_subject)),or(...(condition_grade))));
    }

    const tutors = await query;
    console.log(tutors);
}

/*async function main(subject_pref?: string[]) {
    const query = db.select().from(tutorTable);

    if (subject_pref) {
        const conditions = subject_pref.map(subject => arrayContains(tutorTable.subject_pref, [subject]));
        query.where(or(...(conditions)));
    }

    const tutors = await query;
    console.log(tutors);
}*/

filterTutors([10,11],["Inorganic Chemistry", "American History", "Calculus"]);