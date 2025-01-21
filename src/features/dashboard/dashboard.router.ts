import express from "express";
import { authMiddleware } from "../../middleware/authenticate";
import { authorizationMiddleware } from "../../middleware/authorization";
import { dashboardController } from "./dashboard.controller";

export const dashboardRouter = express.Router();

const { authenticate } = authMiddleware
const {authorize}=authorizationMiddleware
const {GetDashboardController}=dashboardController

dashboardRouter.get("/api/v1/dashboard",authenticate,authorize(["ADMIN"]),GetDashboardController)