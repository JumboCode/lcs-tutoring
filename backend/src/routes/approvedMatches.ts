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
import { requireAuth } from "@clerk/express";

const router = express.Router();
const { FRONTEND_URL } = process.env;

router.get("/approved-matches", requireAuth({signInUrl:FRONTEND_URL}), getApprovedMatches);
router.post("/flag/", requireAuth({signInUrl:FRONTEND_URL}), flagApprovedMatch);
router.post("/unmatch-pair", requireAuth({signInUrl:FRONTEND_URL}), unmatchPair);
router.post("/email", requireAuth({signInUrl:FRONTEND_URL}), emailPair);
router.post("/delete-pair", requireAuth({signInUrl:FRONTEND_URL}), deletePair);
router.post("/perm-delete-match/:match_id", requireAuth({signInUrl:FRONTEND_URL}), permDeleteMatch);


export default router;
