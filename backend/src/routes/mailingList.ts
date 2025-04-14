/***********************************************
 * This file is for the route defs involving mailing list
 ***********************************************/

import { fetchMailingList, deleteEListUser } from "../controllers/mailingListController";
import express from "express";
  
const router = express.Router();
  
router.get("/mailing-list", fetchMailingList);
router.delete("/delete-elist/:id", deleteEListUser);
  
export default router;