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
}