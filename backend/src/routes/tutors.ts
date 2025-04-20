/***********************************************
 * This file is for the route defs involving tutors
 ***********************************************/

import { getTutors, getUnmatchedTutors, unmatchedToHistory, unmatchedToMatched, permDeleteTutor } from "../controllers/tutorController";
import express from "express";
import { requireAuth } from "@clerk/express";

const router = express.Router();
const { FRONTEND_URL } = process.env;

router.get("/tutors", requireAuth({signInUrl:FRONTEND_URL}), getTutors);
router.get("/unmatched-tutors", requireAuth({signInUrl:FRONTEND_URL}), getUnmatchedTutors);
router.post("/move-tutor-to-history/:id", requireAuth({signInUrl:FRONTEND_URL}), unmatchedToHistory);
router.post("/move-tutor-to-matched/:id", requireAuth({signInUrl:FRONTEND_URL}), unmatchedToMatched);
router.post("/perm-delete-tutor/:id", requireAuth({signInUrl:FRONTEND_URL}), permDeleteTutor);

export default router;