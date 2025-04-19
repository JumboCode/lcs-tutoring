/***********************************************
 * This file is for the routes and function imps involving form submission
 ***********************************************/

import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";


import {
  tuteeTable,
  tutorTable,
  unmatchedTable,
  elist
} from "../db/schema";
import { clerkClient } from '@clerk/express'
import { Request, Response } from "express";

const db = drizzle(process.env.DATABASE_URL!);
process.env.CLERK_SECRET_KEY!;

export const tuteeSubmission = async (req: Request, res: Response): Promise<any> => {
  try {
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
    return res.status(200).json({ message: "Tutee form submitted successfully" });
  } catch (error: any) {
    console.error("Error submitting tutee form:", error);

    return res.status(500).send(
      error?.message || "Internal server error while submitting the tutee form"
    );
  }
};

export const tutorSubmission = async (req: Request, res: Response): Promise<any> => {
  try {
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
      num_tutees: numTutees,
      notes: notes,
      language_proficiencies: languageProficiencies,
    });
    for (let i = 0; i < numTutees; i++) {
        await db.insert(unmatchedTable).values({
                tutor_id: id,
              });
    }
    return res.status(200).json({ message: "Tutor form submitted successfully" });
  } catch (error: any) {
    console.error("Error submitting tutor form:", error);

    // dupe id
    if (error.code === "23505") {
      if (error.constraint === "tutor_email_unique") {
        return res.status(409).send("A tutor with this Tufts Email already exists.");
      } else {
        return res.status(409).send("A tutor with this Tufts ID already exists.");
      }
    }

    return res.status(500).send(
      error?.message || "Internal server error while submitting the tutor form"
    );
  }
};

export const handleEList = async (req: Request, res: Response): Promise<any> => {
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

export const createAdmin = async (req: Request, res: Response): Promise<any> => {
  const { emailAddress, password, firstName, lastName } = req.body;
  const regex = /[^A-Za-z0-9]/;
  
  if (emailAddress[0] == "" || password == "" || firstName == "" || lastName == "") {
    return res.status(400).json({ error: "Please fill out all the fields to add a new admin." });
  }
  else if (regex.test(firstName) || regex.test(lastName)) {
    return res.status(400).json({ error: "Please double check the first and last name of the new admin." });
  }
  else if (!emailAddress[0].endsWith("@tufts.edu")) {
    return res.status(400).json({ error: "Only Tufts University emails (@tufts.edu) are allowed." });
  }

  try {
    const user = await clerkClient.users.createUser({
      emailAddress,
      password,
      firstName,
      lastName,
    });

    res.status(200).json({ message: "User created", user });
  } catch (error: any) {
    console.error("Error creating user:", error);

    if (error.status === 422) {
      return res.status(422).json({ error: error.errors[0].message });
    }

    res.status(500).json({ error: "Error submitting the form" });
  }
};

