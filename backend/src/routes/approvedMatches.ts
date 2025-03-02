/***********************************************
 * This file is for the route defs involving approved matches
 ***********************************************/

import {
  getApprovedMatches,
  flagApprovedMatch,
  unmatchPair,
  emailPair,
  moveToInactive,
} from "../controllers/approvedMatchesController";
import express from "express";

const router = express.Router();

router.get("/approved-matches", getApprovedMatches);
router.post("/flag/", flagApprovedMatch);
router.post("/unmatch-pair/:id", unmatchPair);
router.post("/email", emailPair);
router.post("/move-to-inactive/", moveToInactive);

export default router;
