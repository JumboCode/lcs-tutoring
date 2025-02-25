/***********************************************
 * This file is for the route defs involving forms
 ***********************************************/

import { adminEmailSubmission, tuteeSubmission, tutorSubmission, adminLogin} from "../controllers/formController";

import express from "express";

const router = express.Router();

router.post("/tuteesubmission", tuteeSubmission);
router.post("/tutorsubmission", tutorSubmission);
router.post("/admin", adminEmailSubmission);
router.post("/admin-login", adminLogin);

export default router;
