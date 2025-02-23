import express, { Request } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { authRouter } from "../features/auth/auth.router";
import { errorHandler } from "../utils/error/response.error";
import { categoriesRouter } from "../features/categories/categories.router";
import { booksRouter } from "../features/books/books.router";
import { userRouter } from "../features/users/users.router";
import { profilesRouter } from "../features/profiles/profiles.router";
import { borrowRouter } from "../features/borrow/borrow.router";
import { dashboardRouter } from "../features/dashboard/dashboard.router";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/public", express.static(path.join(__dirname, "../../public/images")));

app.use(authRouter);
app.use(categoriesRouter);
app.use(booksRouter);
app.use(userRouter);
app.use(profilesRouter);
app.use(borrowRouter)
app.use(dashboardRouter)
app.use(errorHandler);

export { app };
