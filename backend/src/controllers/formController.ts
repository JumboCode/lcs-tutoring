/***********************************************
 * This file is for the routes and function imps involving form submission
 ***********************************************/

import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";

import {
  tuteeTable,
  tutorTable,
  adminTable,
  unmatchedTable,
  elist
} from "../db/schema";
// import { eq } from "drizzle-orm";
import { Request, Response } from "express";

const db = drizzle(process.env.DATABASE_URL!);

export const tuteeSubmission = async (req: Request, res: Response) => {
  try {
    console.log("This the req body: ", req.body);
    const request = req.body;
    const {
      childFirstName,
      childLastName,
      gender,
      grade,
      specialNeeds,
      specialNeedsInfo,
      parentFirstName,
      parentLastName,
      phone,
      email,
      subjects,
      tutoringMode,
      additionalInfo,
      agreement,
      signature,
    } = request;
    // bad practice, prefer to submit number directly
    console.log("This the subjects: ", subjects);
    const [insertedTutee] = await db.insert(tuteeTable).values({
      tutee_first_name: childFirstName,
      tutee_last_name: childLastName,
      gender: gender,
      grade: grade,
      has_special_needs: specialNeeds === "yes",
      special_needs: specialNeedsInfo,
      parent_first_name: parentFirstName,
      parent_last_name: parentLastName,
      parent_phone: phone,
      parent_email: email,
      subjects: subjects,
      tutoring_mode: tutoringMode,
      notes: additionalInfo,
      date: new Date().toISOString().split("T")[0],
    }).returning({ id: tuteeTable.id });
    await db.insert(unmatchedTable).values({
      tutee_id: insertedTutee.id,
    });
    console.log("Tutee submitted: ", req.body);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error moving to matched");
  }
};

export const tutorSubmission = async (req: Request, res: Response) => {
  try {
    console.log("This the req body: ", req.body);
    const request = req.body;
    const {
      firstName,
      lastName,
      pronouns,
      id,
      major,
      yearGrad,
      phone,
      email,
      pairedWithTutee,
      pairedTutee,
      numTutees,
      gradeLevels,
      comfortableSpecialNeeds,
      subjects,
      languageProficiencies,
      tutoringMode,
      notes,
      agreement,
      signature,
    } = request;
    await db.insert(tutorTable).values({
      id: id,
      first_name: firstName,
      last_name: lastName,
      pronouns: pronouns,
      major: major,
      year_grad: yearGrad,
      phone: phone,
      email: email,
      grade_level_pref: gradeLevels,
      disability_pref: comfortableSpecialNeeds,
      subject_pref: subjects,
      tutoring_mode: tutoringMode,
      date: new Date().toISOString().split("T")[0],
      previous_tutee: pairedWithTutee,
      continuing_tutee_name: pairedTutee,
      num_tutees: numTutees,
      notes: notes,
      language_proficiencies: languageProficiencies,
    });
    await db.insert(unmatchedTable).values({
      tutor_id: id,
    });
    console.log("Tutee submitted: ", req.body);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error moving to matched");
  }
};

export const adminEmailSubmission = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    await db.insert(adminTable).values({
      email: email,
      password: password,
    });
    console.log("Email submitted: ", req.body);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding new admin");
  }
};

// TODO: add clerk auth
export const adminLogin = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;


  try {
    const admins = await db.select().from(adminTable).where(eq(adminTable.email, email));

    console.log(email);
    console.log(password);

    if (admins.length === 0) {
      console.log("Here")
      return res.status(401).json({ success: false, message: "Incorrect email or password" });
    }

    const admin = admins[0];

    console.log("Password equal: ", (password === admin.password));

    if (password === admin.password) {
      res.json({ success: true, message: "Logged in successfully" });
    } else {
      res.send(401).json({ success: false, message: "Incorrect email or password" });
    }
  } catch (error) {
    console.error("Login error", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const handleEList = async (req: Request, res: Response) => {
  try {
    const { tuftsEmail, gradYear, fullName } = req.body;

    // Check for duplicate email in the elist table
    const existingEmail = await db
      .select()
      .from(elist)
      .where(eq(elist.email, tuftsEmail));

    if (existingEmail.length > 0) {
      return res.status(400).json({ success: false, message: "Email already exists in the mailing list" });
    }
    await db.insert(elist).values({
      name: fullName,
      email: tuftsEmail,
      year_grad: gradYear
    });

    console.log("Email added to mailing list: ", tuftsEmail);
    res.status(200).json({ success: true, message: "Email added to mailing list" });
  } catch (error) {
    console.error("Error adding email to mailing list", error);
    res.status(500).json({ success: false, message: "Error adding email to mailing list" });
  }
}