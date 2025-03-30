/***********************************************
 * This file is for the route defs involving forms
 ***********************************************/

import { tuteeSubmission, tutorSubmission, handleEList, createAdmin} from "../controllers/formController";

import express from "express";

const router = express.Router();

router.post("/tuteesubmission", tuteeSubmission);
router.post("/tutorsubmission", tutorSubmission);
router.post("/e-list", handleEList);
router.post('/create-admin', createAdmin);

export default router;
