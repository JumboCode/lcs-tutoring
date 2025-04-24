/***********************************************
 * This file is for the route defs involving tutors
 ***********************************************/

import "dotenv/config";
import {
  getTutors,
  getUnmatchedTutors,
  unmatchedToHistory,
  unmatchedToMatched,
  permDeleteTutor,
  togglePriorityFlag,
} from "../controllers/tutorController";
import express from "express";
import { requireAuth } from "@clerk/express";

export const router = express.Router();
const { FRONTEND_URL } = process.env;

router.get("/tutors", requireAuth({signInUrl:FRONTEND_URL}), getTutors);
router.get("/unmatched-tutors", requireAuth({signInUrl:FRONTEND_URL}), getUnmatchedTutors);
router.post("/move-tutor-to-history/:id", requireAuth({signInUrl:FRONTEND_URL}), unmatchedToHistory);
router.post("/move-tutor-to-matched/:id", requireAuth({signInUrl:FRONTEND_URL}), unmatchedToMatched);
router.post("/perm-delete-tutor/:id", requireAuth({signInUrl:FRONTEND_URL}), permDeleteTutor);
router.post("/toggle-tutor-priority-flag/:id", requireAuth({signInUrl:FRONTEND_URL}), togglePriorityFlag);

export default router;