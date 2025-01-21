import express from "express";
import { authMiddleware } from "../../middleware/authenticate";
import { userController } from "./users.controller";
import { authorizationMiddleware } from "../../middleware/authorization";

export const userRouter = express.Router();

const {authenticate} = authMiddleware
const { authorize } = authorizationMiddleware
const {createUserAdminController,deleteUserController,getUsersController,getMyborrowController}=userController

userRouter.get("/api/v1/users", authenticate, authorize(["ADMIN"]),getUsersController);

userRouter.post("/api/v1/users/create-admin", authenticate,authorize(["ADMIN"]),createUserAdminController);

userRouter.delete("/api/v1/users/:id", authenticate, authorize(["ADMIN"]),deleteUserController);

userRouter.get("/api/v1/users/my-borrow", authenticate, authorize(["USER"]),getMyborrowController);