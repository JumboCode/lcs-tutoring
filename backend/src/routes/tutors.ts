/***********************************************
 * This file is for the route defs involving tutors
 ***********************************************/

import { getTutors, getUnmatchedTutors, matchedToHistory, unmatchedToMatched } from "../controllers/tutorController";
import express from "express";

const router = express.Router();

router.get("/tutors", getTutors);
router.get("/unmatched-tutors", getUnmatchedTutors);
router.post("/move-tutor-to-history/:id", matchedToHistory);
router.post("/move-tutor-to-matched/:id", unmatchedToMatched);

export default router;