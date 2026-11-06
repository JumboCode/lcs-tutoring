/***********************************************
 * This file is for the route defs involving approved matches
 ***********************************************/

import {
  getApprovedMatches,
  flagApprovedMatch,
  unmatchPair,
  emailPair,
  deletePair,
  permDeleteMatch,
  editPair,
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
router.post("/edit-pair", requireAuth({signInUrl:FRONTEND_URL}), editPair);


export default router;
