import {
  fetchWhitelistedUsers,
  deleteUser,
} from "../controllers/userController";
import express from "express";
import { requireAuth } from "@clerk/express";

const router = express.Router();
const { FRONTEND_URL } = process.env;

router.get("/whitelisted-users", requireAuth({signInUrl:FRONTEND_URL}), fetchWhitelistedUsers);
router.delete("/whitelisted-users/:userId", requireAuth({signInUrl:FRONTEND_URL}), deleteUser);

export default router;
