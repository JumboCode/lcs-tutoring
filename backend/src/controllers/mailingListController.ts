import { clerkClient } from "@clerk/express";
import { Request, Response } from "express";
import { elist } from "../db/schema";

import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import TutorMatcher from "../algorithm.js";

const db = drizzle(process.env.DATABASE_URL!);

export const fetchMailingList = async (req: Request, res: Response) => {
    const members =
        await db.select({
            id: elist.id,
            name: elist.name,
            email: elist.email,
            gradYear: elist.year_grad
        })
        .from(elist)
        // .innerJoin(tutorTable, eq(approvedMatchesTable.tutor_id, tutorTable.id))
        // .innerJoin(tuteeTable, eq(approvedMatchesTable.tutee_id, tuteeTable.id))
        // .where(and(eq(approvedMatchesTable.active, false), inArray(approvedMatchesTable.id, matchIds)));
        res.send({
            mailingList: members,
        });
};

export const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  await clerkClient.users.deleteUser(userId);
  res.status(200).json({ message: "User deleted successfully" });
};
