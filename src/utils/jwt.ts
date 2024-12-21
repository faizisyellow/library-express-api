import jwt from "jsonwebtoken";
import { ResponseError } from "./error/response.error";

export const JWT_SECRET = process.env.JWT_SECRET as string;

const generateToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "15d" });
};

const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "30d" });
};

const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded;
  } catch (error) {
    throw new ResponseError(400, "Invalid or expired token");
  }
};

const verifyRefreshToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new ResponseError(400, "Refresh token expired");
    } else {
      throw new ResponseError(500, "Invalid or malformed refresh token");
    }
  }
};

export const jwtConfig = {
  generateToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
};
