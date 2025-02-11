import { PrismaClient } from "@prisma/client";

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
  try {
    return await prismaClient.$transaction(async (tx) => {
      const book = await tx.book.findUnique({
        where: { id: req.bookId }
      });

      if (!book) {
        throw new Error("Book not found");
      }

      if (book.stock <= 0) {
        throw new Error("Book is out of stock");
      }

      const existingBorrow = await tx.borrowing.findFirst({
        where: {
          bookId: req.bookId,
          userId: req.userId,
          status: "borrowed"
        }
      });

      if (existingBorrow) {
        throw new Error("You already have this book borrowed");
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
  } catch (error) {
    throw new Error(error as string);
  }
}

async function GetBorrowBook() {
  try {
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
  } catch (error) {
    throw new Error(error as string);
  }
}

const ReturnBook = async (borrowId: string) => {
  try {
    return await prismaClient.$transaction(async (tx) => {
      const borrow = await tx.borrowing.findUnique({
        where: { id: borrowId },
        include: { book: true }
      });

      if (!borrow) {
        throw new Error("Borrow record not found");
      }

      if (borrow.status === "returned") {
        throw new Error("Book has already been returned");
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
  } catch (error) {
    throw new Error(error as string);
  }
};

export const borrowingService = {
  CreateBorrowBook,
  GetBorrowBook,
  ReturnBook,
};