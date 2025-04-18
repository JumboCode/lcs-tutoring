/***********************************************
 * This file is for the route defs involving tutors
 ***********************************************/

import { getTutors, getUnmatchedTutors, unmatchedToHistory, unmatchedToMatched, permDeleteTutor } from "../controllers/tutorController";
import express from "express";

const router = express.Router();

router.get("/tutors", getTutors);
router.get("/unmatched-tutors", getUnmatchedTutors);
router.post("/move-tutor-to-history/:id", unmatchedToHistory);
router.post("/move-tutor-to-matched/:id", unmatchedToMatched);
router.post("/perm-delete-tutor/:id", permDeleteTutor);

export default router;