/***********************************************
 * This file is for the routes and function imps involving form submission
 ***********************************************/

import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import validator from "validator";

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

    const fields = [
      childFirstName,
      childLastName,
      gender,
      grade,
      parentFirstName,
      parentLastName,
      phone,
      email,
      subjects,
      tutoringMode,
      agreement,
      signature,
    ];

    const allFieldsFilled = fields.every((field) => {
      if (Array.isArray(field)) return field.length > 0;
      if (typeof field === "boolean") return field !== null;
      return field !== undefined && field !== null && String(field).trim() !== "";
    });
    
    if (!allFieldsFilled) {
      return res.status(400).json({ error: "Please fill out all required fields." });
    }

    if (phone.length != 10 || isNaN(Number(phone))) {
      return res.status(400).json({ error: "Phone number must be a 10-digit number." });
    }

    if (agreement !== "Yes") {
      return res.status(400).json({ error: "You must agree to the agreement." });
    }

    if (signature.trim() !== `${parentFirstName.trim()} ${parentLastName.trim()}`) {
      return res.status(400).json({ error: `Signature is not of the form "${parentFirstName} ${parentLastName}".` });
    }

    if (tutoringMode !== "In-Person" && tutoringMode !== "Online" && tutoringMode !== "Hybrid" && tutoringMode !== "Anything") {
      return res.status(400).json({ error: "Invalid tutoring mode" });
    }

    if (!validator.isEmail(email)) {
      if (email.length != 0) {
        return res.status(400).json({ error: "Invalid email address" });
      }
    }

    if (grade < 0 || grade > 12) {
      return res.status(400).json({ error: "Invalid grade level (0 - 12)" });
    }

    const allowedSubjects = new Set([
      "Early Reading",
      "Reading",
      "English",
      "Math",
      "Geometry",
      "Algebra",
      "Precalculus",
      "Calculus",
      "Statistics",
      "Computer Science",
      "Science",
      "Biology",
      "Chemistry",
      "Spanish",
      "French",
      "Italian",
      "SAT/ACT",
      "US History",
      "Global History",
      "Other",
    ]);

    if (!Array.isArray(subjects) || !subjects.every((subject: string) =>
      typeof subject === "string" && allowedSubjects.has(subject))) {
        return res.status(400).json({ error: "Invalid subject preference" });
    }

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

    const fields = [
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
      tutoringMode,
      agreement,
      signature,
    ];
    
    const allFieldsFilled = fields.every((field) => {
      if (Array.isArray(field)) return field.length > 0;
      if (typeof field === "boolean") return field !== null;
      return field !== undefined && field !== null && String(field).trim() !== "";
    });
    
    if (!allFieldsFilled) {
      return res.status(400).json({ error: "Please fill out all required fields." });
    }

    if (id.length != 7 || isNaN(Number(id))) {
      return res.status(400).json({ error: "Tufts ID must be a 7-digit number." });
    }

    if (phone.length != 10 || isNaN(Number(phone))) {
      return res.status(400).json({ error: "Phone number must be a 10-digit number." });
    }

    if (
      yearGrad.length != 4 ||
      isNaN(Number(yearGrad)) || 
      !(
        Number(yearGrad) >= new Date().getFullYear() && 
        Number(yearGrad) <= new Date().getFullYear() + 4
      )
    ) {
      return res.status(400).json({ error: `Invalid Year of Graduation (Between ${new Date().getFullYear()} - ${
        new Date().getFullYear() + 4
      })` });
    }

    if (!email.endsWith("@tufts.edu")) {
      return res.status(400).json({ error: "Invalid Tufts Email" });
    }

    if (agreement !== "Yes") {
      return res.status(400).json({ error: "You must agree to the agreement." });
    }

    if (signature.trim() !== `${firstName.trim()} ${lastName.trim()}`) {
      return res.status(400).json({ error: `Signature is not of the form "${firstName} ${lastName}".` });
    }

    if (numTutees < 1 || numTutees > 6) {
      return res.status(400).json({ error: "Number of tutees must be between 1 and 6." });
    }

    if (tutoringMode !== "In-Person" && tutoringMode !== "Online" && tutoringMode !== "Hybrid" && tutoringMode !== "Anything") {
      return res.status(400).json({ error: "Invalid tutoring mode" });
    }
    
    if (!Array.isArray(gradeLevels)) {
      return res.status(400).json({ error: "Invalid grade level preference" });
    }

    const seen = new Set<number>();

    for (const grade of gradeLevels) {
      if (typeof grade !== "number" || grade < 0 || grade > 12) {
        return res.status(400).json({ error: "Invalid grade level preference (0 - 12)" });
      }
      if (seen.has(grade)) {
        return res.status(400).json({ error: "Duplicate grade level preference" });
      }
      seen.add(grade);
    }

    const allowedSubjects = new Set([
      "Early Reading",
      "Reading",
      "English",
      "Math",
      "Geometry",
      "Algebra",
      "Precalculus",
      "Calculus",
      "Statistics",
      "Computer Science",
      "Science",
      "Biology",
      "Chemistry",
      "Spanish",
      "French",
      "Italian",
      "SAT/ACT",
      "US History",
      "Global History",
      "Other",
    ]);

    if (!Array.isArray(subjects) || !subjects.every((subject: string) =>
      typeof subject === "string" && allowedSubjects.has(subject))) {
        return res.status(400).json({ error: "Invalid subject preference" });
    }

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
    const existingEmail = await db
      .select()
      .from(elist)
      .where(eq(elist.email, email));

    if (existingEmail.length == 0) {
      await db.insert(elist).values({
        name: `${firstName} ${lastName}`,
        email: email,
        year_grad: yearGrad
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

    const currentYear = new Date().getFullYear();

    if (
      isNaN(gradYear) ||
      gradYear < currentYear ||
      gradYear > currentYear + 4
    ) {
      return res.status(400).json({
        success: false,
        message: `Graduation year must be between ${currentYear} and ${currentYear + 4}.`,
      });
    }

    if (!/^[A-Za-z]+$/.test(fullName.trim()) || fullName.trim().length == 0) {
      return res.status(400).json({
        success: false,
        message: "Must be a valid name",
      });
    }

    if (!tuftsEmail.endsWith("@tufts.edu")) {
      return res.status(400).json({
        success: false,
        message: "Email must end with @tufts.edu",
      });
    }

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

    // console.log("Email added to mailing list: ", tuftsEmail);
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

