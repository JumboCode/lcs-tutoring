/***********************************************
 * This file is for the route defs involving match suggestions
 ***********************************************/

import { getMatchSuggestions } from "../controllers/matchSuggestionsController";
import express from "express";

const router = express.Router();

router.get("/tutors", getMatchSuggestions);

export default router;