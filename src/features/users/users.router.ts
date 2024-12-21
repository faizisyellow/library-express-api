import express from "express";
import { authMiddleware } from "../../middleware/authenticate";
import { userController } from "./users.controller";
import { authorizationMiddleware } from "../../middleware/authorization";

export const userRouter = express.Router();

userRouter.get("/api/v1/users", authMiddleware.authenticate, authorizationMiddleware.authorize(["ADMIN"]), userController.getUsersController);

userRouter.post("/api/v1/users/create-admin", authMiddleware.authenticate, authorizationMiddleware.authorize(["ADMIN"]), userController.createUserAdminController);

userRouter.delete("/api/v1/users/:id", authMiddleware.authenticate, authorizationMiddleware.authorize(["ADMIN"]), userController.deleteUserController);
