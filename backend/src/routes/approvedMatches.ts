/***********************************************
 * This file is for the route defs involving approved matches
 ***********************************************/

import { getApprovedMatches, flagApprovedMatch, unmatchPair, emailPair } from "../controllers/approvedMatchesController";
import express from "express";

const router = express.Router();

router.get("/approved-matches", getApprovedMatches);
router.post("/flag/:match-id", flagApprovedMatch);
router.post("/unmatch-pair/:match-id", unmatchPair);
router.post("/email", emailPair);

export default router;