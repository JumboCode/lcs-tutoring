/***********************************************
 * This file is for the route defs involving forms
 ***********************************************/

import "dotenv/config";
import { tuteeSubmission, tutorSubmission, handleEList, createAdmin} from "../controllers/formController";
import express from "express";
import { requireAuth } from "@clerk/express";

const router = express.Router();
const { FRONTEND_URL } = process.env;

router.post("/tuteesubmission", tuteeSubmission);
router.post("/tutorsubmission", tutorSubmission);
router.post("/e-list", handleEList);
router.post('/create-admin', requireAuth({signInUrl:FRONTEND_URL}), createAdmin);

export default router;
