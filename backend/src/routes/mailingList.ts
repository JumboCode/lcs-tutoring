/***********************************************
 * This file is for the route defs involving mailing list
 ***********************************************/

import { fetchMailingList, deleteEListUser } from "../controllers/mailingListController";
import express from "express";
import { requireAuth } from "@clerk/express";
  
const router = express.Router();
const { FRONTEND_URL } = process.env;
  
router.get("/mailing-list", requireAuth({signInUrl:FRONTEND_URL}), fetchMailingList);
router.delete("/delete-elist/:id", requireAuth({signInUrl:FRONTEND_URL}), deleteEListUser);
  
export default router;