import {
    fetchMailingList,
    //deleteUser,
  } from "../controllers/mailingListController";
  import express from "express";
  
  const router = express.Router();
  
  router.get("/mailing-list", fetchMailingList);
//   router.delete("/whitelisted-users/:userId", deleteUser);
  
  export default router;