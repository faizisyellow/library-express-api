import express from "express";
import upload from "../../utils/upload";
import { booksController } from "./books.controller";
import { authMiddleware } from "../../middleware/authenticate";
import { authorizationMiddleware } from "../../middleware/authorization";

export const booksRouter = express.Router();

booksRouter.get("/api/v1/books/report", booksController.downloadBookReportController)


const { authenticate } = authMiddleware;
const { authorize } = authorizationMiddleware;

booksRouter.get("/api/v1/books", authenticate, authorize(["ADMIN", "USER"]), booksController.getBookController);

booksRouter.get("/api/v1/books/:id", authenticate, authorize(["ADMIN"]), booksController.getBookByIdController);

booksRouter.post("/api/v1/books", authenticate, authorize(["ADMIN"]), upload.single("coverImage"), booksController.createBookController);

booksRouter.patch("/api/v1/books/:id", authenticate, authorize(["ADMIN"]), upload.single("coverImage"), booksController.updateBookController);

booksRouter.delete("/api/v1/books/:id", authenticate, authorize(["ADMIN"]), booksController.deleteBookController);
