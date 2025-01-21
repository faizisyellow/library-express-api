
import express from "express";
import { borrowControllers } from "./borrow.controller";
import { authMiddleware } from "../../middleware/authenticate";
import { authorizationMiddleware } from "../../middleware/authorization";



export const borrowRouter = express.Router();

const { authenticate } = authMiddleware;
const { authorize } = authorizationMiddleware;
const {CreateBorrowBookByUserController,GetBorrowBookController,ReturnBorrowBookController}=borrowControllers
 
borrowRouter.get("/api/v1/borrow-book", authenticate, authorize(["ADMIN"]), GetBorrowBookController)

borrowRouter.post("/api/v1/borrow-book", authenticate, authorize(["USER"]), CreateBorrowBookByUserController)

borrowRouter.patch("/api/v1/borrow-book/return-book", authenticate, authorize(["USER"]), ReturnBorrowBookController)
