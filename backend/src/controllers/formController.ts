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
} from "../db/schema";
// import { eq } from "drizzle-orm";
import { Request, Response } from "express";

const db = drizzle(process.env.DATABASE_URL!);

export const tuteeSubmission = async (req: Request, res: Response) => {
  try {
    console.log("This the req body: ", req.body);
    const request = req.body;
    const {
      id,
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
    const gradeNum = Number(grade);
    console.log("This the subjects: ", subjects);
    await db.insert(tuteeTable).values({
      id: id,
      tutee_first_name: childFirstName,
      tutee_last_name: childLastName,
      gender: gender,
      grade: gradeNum,
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
      history_date: new Date().toISOString().split("T")[0],
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
    console.log("Tutee submitted: ", req.body);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error moving to matched");
  }
};

export const adminEmailSubmission = async (req: Request, res: Response) => {
  try {
    const email = req.params.email;
    const password = req.params.password;
    await db.insert(adminTable).values({
      email: email,
      password: password,
      // TODO
    });
    console.log("Email submitted: ", req.body);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding new admin");
  }
};


// // what do we put in here
// export const adminLoginRequest = async (req: Request, res: Response) => {

// };

// export const adminLogin = async (req: Request, res: Response) => {
//   const { email, password } = req.body;

//   try {
//     // Adjust this query according to your actual ORM syntax
//     const admins = await db.query(adminTable)
//                            .where(adminTable.email.eq(email))
//                            .execute();

//     if (admins.length === 0) {
//       res.status(404).json({ success: false, message: "Incorrect log-in information" });
//       return;
//     }

//     const admin = admins[0];  // Assuming the first returned record is the one we need
//     const isMatch = await db.compare(password, admin.password);
//     if (isMatch) {
//       res.json({ success: true, message: "Logged in successfully" });
//     } else {
//       res.json({ success: false, message: "Incorrect log-in information" });
//     }
//   } catch (error) {
//     console.error("Login error", error);
//     res.status(500).send("Server error");
//   }
// };

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