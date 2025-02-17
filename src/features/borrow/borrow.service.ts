import { PrismaClient } from "@prisma/client";
import { ResponseError } from "../../utils/error/response.error";

export interface CreateBook {
  bookId: string;
  userId: string;
}

const prismaClient = new PrismaClient();

function getCurrentDate() {
  const date = new Date();
  const offset = date.getTimezoneOffset() * 60000; 
  return new Date(date.getTime() - offset);
}

async function CreateBorrowBook(req: CreateBook) {
    return await prismaClient.$transaction(async (tx) => {
      const book = await tx.book.findUnique({
        where: { id: req.bookId }
      });

      if (!book) {
        throw new ResponseError(404,"Book not found");
      }

      const existingBorrow = await tx.borrowing.findFirst({
        where: {
          bookId: req.bookId,
          userId: req.userId,
          status: "borrowed"
        }
      });

      if (book.stock <= 0 && !existingBorrow) {
        throw new ResponseError(400,"Book is out of stock");
      }

      if (existingBorrow) {
        throw new ResponseError(400,"You already have this book borrowed");
      }

      // Decrease book stock
      await tx.book.update({
        where: { id: req.bookId },
        data: { stock: { decrement: 1 } }
      });

      return await tx.borrowing.create({
        data: {
          bookId: req.bookId,
          userId: req.userId,
          borrowDate: getCurrentDate(),
        },
      });
    });

}

async function GetBorrowBook() {

    const borrows = await prismaClient.borrowing.findMany({
      select: {
        id: true,
        borrowDate: true,
        returnDate: true,
        status: true,
        book: {
          select: {
            id: true,
            title: true,
            author: true,
            coverImage: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

  
    return borrows.map(borrow => ({
      ...borrow,
      borrowDate: new Date(borrow.borrowDate).toLocaleString(),
      returnDate: borrow.returnDate ? new Date(borrow.returnDate).toLocaleString() : null,
    }));
 
}

const ReturnBook = async (borrowId: string) => {
    return await prismaClient.$transaction(async (tx) => {
      const borrow = await tx.borrowing.findUnique({
        where: { id: borrowId },
        include: { book: true }
      });

      if (!borrow) {
        throw new ResponseError(404,"Borrow record not found");
      }

      if (borrow.status === "returned") {
        throw new ResponseError(400,"Book has already been returned");
      }

      // Increase book stock
      await tx.book.update({
        where: { id: borrow.bookId },
        data: { stock: { increment: 1 } }
      });

      return await tx.borrowing.update({
        where: { id: borrowId },
        data: {
          status: "returned",
          returnDate: getCurrentDate(),
        },
      });
    });

};

export const borrowingService = {
  CreateBorrowBook,
  GetBorrowBook,
  ReturnBook,
};