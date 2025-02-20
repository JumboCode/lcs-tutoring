/***********************************************
 * This file is for the route defs involving tutees
 ***********************************************/

import { getTutees, getUnmatchedTutees, matchedToHistory } from "../controllers/tuteeController";
import express from "express";

const router = express.Router();

router.get("/tutees", getTutees);
router.get("/unmatched-tutees", getUnmatchedTutees);
router.post("/move-tutee-to-history/:id", matchedToHistory);

export default router;