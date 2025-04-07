import { clerkClient } from "@clerk/express";
import { Request, Response } from "express";
export const fetchWhitelistedUsers = async (req: Request, res: Response) => {
  const { data: users } = await clerkClient.users.getUserList({
    limit: 100,
  });
  res.status(200).json(users);
};

export const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  await clerkClient.users.deleteUser(userId);
  res.status(200).json({ message: "User deleted successfully" });
};
