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
      .selectDistinct()
      .from(tuteeTable)
      .innerJoin(unmatchedTable, eq(tuteeTable.id, unmatchedTable.tutee_id));

    const historyTutees = await db
      .selectDistinct()
      .from(tuteeTable)
      .innerJoin(historyTable, eq(tuteeTable.id, historyTable.tutee_id));

    res.send({
      matchedTutees: matchedTutees,
      unmatchedTutees: unmatchedTutees,
      historyTutees: historyTutees,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching tutees");
  }
};

/* returns all the unmatched tutees */
export const getUnmatchedTutees = async ( req: Request, res: Response) => {
  try {
    console.log("Inside unmatched tutees endpoint");

    const unmatchedTutees = await db
      .select()
      .from(tuteeTable)
      .innerJoin(unmatchedTable, eq(tuteeTable.id, unmatchedTable.tutee_id));

    res.send({
      unmatchedTutees: unmatchedTutees.map((row) => row.tutee),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching tutees");
  }
};

/* Moves a tutee from UNMATCHED -> HISTORY given their id */
export const unmatchedToHistory = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    console.log("id as a string: ", id);
    console.log(Number(id));
    const tutee_id = (Number(id));
    if (tutee_id > 0) {
      const query = await db
        .select()
        .from(unmatchedTable)
        .where(eq(unmatchedTable.tutee_id, tutee_id)); //returns an array with only one element
  
      if (query.length > 0) {
        await db.insert(historyTable).values(query[0]); //inserts only one row into matchedTable
  
        await db.delete(unmatchedTable).where(eq(unmatchedTable.tutee_id, tutee_id));

        res.json({ success: true, message: "Tutee moved" });
  
      } else {
        throw new Error("ID not found in matched table");
      }
    } else {
      throw new Error("Invalid ID");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error moving to history");
  }
};