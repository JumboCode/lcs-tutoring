/***********************************************
 * This file is for the route defs involving match suggestions
 ***********************************************/

import { getMatchSuggestions, approveMatch } from "../controllers/matchSuggestionsController";
import express from "express";
import { requireAuth } from "@clerk/express";

const router = express.Router();
const { FRONTEND_URL } = process.env;

router.get("/match-suggestions", requireAuth({signInUrl:FRONTEND_URL}), getMatchSuggestions);
router.post("/approve-match", requireAuth({signInUrl:FRONTEND_URL}), approveMatch);

export default router;