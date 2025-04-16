/***********************************************
 * This file is for the route defs involving approved matches
 ***********************************************/

import {
  getApprovedMatches,
  flagApprovedMatch,
  unmatchPair,
  emailPair,
  deletePair,
  permDeleteMatch
} from "../controllers/approvedMatchesController";
import express from "express";

const router = express.Router();

router.get("/approved-matches", getApprovedMatches);
router.post("/flag/", flagApprovedMatch);
router.post("/unmatch-pair", unmatchPair);
router.post("/email", emailPair);
router.post("/delete-pair", deletePair);
router.post("/perm-delete-match/:match_id", permDeleteMatch);


export default router;
