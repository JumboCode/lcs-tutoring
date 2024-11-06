import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { tutorTable } from './db/schema';
import { or, arrayContains } from 'drizzle-orm';

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
async function filterTutors(gradeLevels?: number[]) {
    const query = db.select().from(tutorTable);
  
    if (gradeLevels && gradeLevels.length > 0) {
        const conditions = gradeLevels.map(level => arrayContains(tutorTable.grade_level_pref, [level]));
        query.where(or(...conditions));
    }
  
    const tutors = await query;
    return tutors;
  }
  
  filterTutors([9, 10, 11]).then(tutors => {
    console.log(tutors);
  });