import { NextFunction, Request, Response } from "express";
import { userService } from "../features/users/users.service";
import { User } from "@prisma/client";

const authorize = (requiredRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req;

  try {
    const user = (await userService.getUserById(userId!)) as User;

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Check if user has one of the required roles
    const hasPermission = requiredRoles.includes(user.role);
    if (hasPermission) {
      next();
      return;
    }

    res.status(403).json({ message: "Access denied: You are not authorized." });
    return;
  } catch (error) {
    throw new Error(error as string);
    return;
  }
};

export const authorizationMiddleware = {
  authorize,
};
