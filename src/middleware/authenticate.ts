import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/jwt";

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({
      status: "Failed",
      code: 401,
      message: "Please log in to continue.",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET as string) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      code: 400,
      message: "Invalid or expired access token",
    });
    return;
  }
};

export const authMiddleware = { authenticate };
