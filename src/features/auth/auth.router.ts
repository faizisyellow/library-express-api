import express from "express";
import { authController } from "./auth.controller";

export const authRouter = express.Router();
authRouter.post("/api/v1/auth/signup", authController.signup);
authRouter.post("/api/v1/auth/login", authController.login);
authRouter.post("/api/v1/auth/logout", authController.logout);
