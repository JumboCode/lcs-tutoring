import { Request, Response } from "express";
import { elist } from "../db/schema";

import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";

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
    res.status(200).json({
        mailingList: members,
    });
};

export const deleteEListUser = async (req: Request, res: Response) => {
    console.log("Deleting user from mailing list");
    try {
        const { id } = req.params;
        await db.delete(elist).where(eq(elist.id, Number(id)));
        res.status(200).json({ message: "Elist user deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting user from mailing list");
    }
};