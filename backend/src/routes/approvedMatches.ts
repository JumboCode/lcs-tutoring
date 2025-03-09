/***********************************************
 * This file is for the route defs involving approved matches
 ***********************************************/

import {
  getApprovedMatches,
  flagApprovedMatch,
  unmatchPair,
  emailPair,
  moveToInactive,
  deletePair,
} from "../controllers/approvedMatchesController";
import express from "express";

const router = express.Router();

router.get("/approved-matches", getApprovedMatches);
router.post("/flag/", flagApprovedMatch);
router.post("/unmatch-pair/:id", unmatchPair);
router.post("/email", emailPair);
router.post("/move-to-inactive/", moveToInactive);
router.post("/delete-pair/:id", deletePair);

export default router;
