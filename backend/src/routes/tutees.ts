/***********************************************
 * This file is for the route defs involving tutees
 ***********************************************/

import "dotenv/config";
import { 
    getTutees,
    getUnmatchedTutees, 
    unmatchedToHistory, 
    permDeleteTutee, 
    togglePriorityFlag 
} from "../controllers/tuteeController";
import express from "express";
import { requireAuth } from "@clerk/express";

const router = express.Router();
const { FRONTEND_URL } = process.env;

router.get("/tutees", requireAuth({signInUrl:FRONTEND_URL}), getTutees);
router.get("/unmatched-tutees", requireAuth({signInUrl:FRONTEND_URL}), getUnmatchedTutees);
router.post("/move-tutee-to-history/:id", requireAuth({signInUrl:FRONTEND_URL}), unmatchedToHistory);
router.post("/perm-delete-tutee/:id", requireAuth({signInUrl:FRONTEND_URL}), permDeleteTutee);
router.post("/toggle-tutee-priority-flag/:id", requireAuth({signInUrl:FRONTEND_URL}), togglePriorityFlag);

export default router;