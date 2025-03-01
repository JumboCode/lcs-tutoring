/***********************************************
 * This file is for the route defs involving match suggestions
 ***********************************************/

import { getMatchSuggestions, approveMatch } from "../controllers/matchSuggestionsController";
import express from "express";

const router = express.Router();

router.get("/match-suggestions", getMatchSuggestions);

router.post("/approve-match", approveMatch);

export default router;