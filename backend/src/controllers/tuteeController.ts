/***********************************************
 * This file is for the routes and function imps involving tutees
 ***********************************************/

import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import {
  matchedTable,
  tuteeTable,
  unmatchedTable,
  historyTable,
} from "../db/schema";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

const db = drizzle(process.env.DATABASE_URL!);

/* returns all the matched and unmatched tutees with the filter applied */
export const getTutees = async ( req: Request, res: Response) => {
  try {
    console.log("Inside tutees endpoint");
    const matchedTutees = await db
      .select()
      .from(tuteeTable)
      .innerJoin(matchedTable, eq(tuteeTable.id, matchedTable.tutee_id));

    const unmatchedTutees = await db
      .select()
      .from(tuteeTable)
      .innerJoin(unmatchedTable, eq(tuteeTable.id, unmatchedTable.tutee_id));

    const historyTutees = await db
      .select()
      .from(tuteeTable)
      .innerJoin(historyTable, eq(tuteeTable.id, historyTable.tutee_id));

    res.send({
      matchedTutees: matchedTutees.map((row) => row.tutee),
      unmatchedTutees: unmatchedTutees.map((row) => row.tutee),
      historyTutees: historyTutees.map((row) => row.tutee),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching tutees");
  }
};

/* Moves a tutee from MATCHED -> HISTORY given their id */
export const matchedToHistory = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    console.log("id as a string: ", id);
    console.log(Number(id));
    moveTuteeToHistory(Number(id));
  } catch (error) {
    console.error(error);
    res.status(500).send("Error moving to history");
  }
};

async function moveTuteeToHistory(tutee_id: number) {
  console.log("in move tutee to history");
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
  }
}