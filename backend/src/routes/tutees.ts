/***********************************************
 * This file is for the route defs involving tutees
 ***********************************************/

import { getTutees, matchedToHistory } from "../controllers/tuteeController";
import express from "express";

const router = express.Router();

router.get("/tutees", getTutees);
router.post("/move-tutee-to-history/:id", matchedToHistory);

export default router;