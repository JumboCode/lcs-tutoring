import {
  fetchWhitelistedUsers,
  deleteUser,
} from "../controllers/userController";
import express from "express";

const router = express.Router();

router.get("/whitelisted-users", fetchWhitelistedUsers);
router.delete("/whitelisted-users/:userId", deleteUser);

export default router;
