import jwt from "jsonwebtoken";
import { ResponseError } from "./error/response.error";

export const JWT_SECRET = "helloworld";

const generateToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "15d" });
};

const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded;
  } catch (error) {
    throw new ResponseError(400, "Invalid or expired token");
  }
};



export const jwtConfig = {
  generateToken,
  verifyToken,
};
