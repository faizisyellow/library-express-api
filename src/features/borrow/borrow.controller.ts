import { NextFunction, Request, Response } from "express";
import { borrowingService, CreateBook } from "./borrow.service";
import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

async function GetBorrowBookController(req: Request, res: Response, next: NextFunction) {
  try {
    const borrowBooks = await borrowingService.GetBorrowBook();

    res.status(200).json({
      status: "Success",
      code: 200,
      data: borrowBooks,
      message: "Get borrow books successful",
    });
  } catch (error) {
    next(error);
  }
}

async function CreateBorrowBookByUserController(req: Request, res: Response, next: NextFunction) {
  const { bookId } = req.body;
  const userId = req.userId!;

  const payload: CreateBook = {
    bookId,
    userId,
  };
  try {
    await borrowingService.CreateBorrowBook(payload);

    res.status(201).json({
      status: "Success",
      code: 201,
      message: "Borrow book successful",
    });
  } catch (error) {
    next(error);
  }
}

const ReturnBorrowBookController = async (req: Request, res: Response, next: NextFunction) => {
  const { borrowId } = req.body;

  try {
    await borrowingService.ReturnBook(borrowId);
    res.status(200).json({
      status: "Success",
      code: 200,
      message: "Return Book successful",
    });
  } catch (error) {
    next(error);
  }
};

export const borrowControllers = {
  CreateBorrowBookByUserController,
  GetBorrowBookController,
  ReturnBorrowBookController,
};
