/***********************************************
 * This file is for the route defs involving tutees
 ***********************************************/

import { getTutees, getUnmatchedTutees, unmatchedToHistory, permDeleteTutee } from "../controllers/tuteeController";
import express from "express";

const router = express.Router();

router.get("/tutees", getTutees);
router.get("/unmatched-tutees", getUnmatchedTutees);
router.post("/move-tutee-to-history/:id", unmatchedToHistory);
router.post("/perm-delete-tutee/:id", permDeleteTutee);

export default router;