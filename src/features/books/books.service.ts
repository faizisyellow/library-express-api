import { Book, PrismaClient } from "@prisma/client";
import { CreateBookRequest, GetBookReponse, UpdateBookRequest } from "./books.model";
import { ResponseError } from "../../utils/error/response.error";
import path from "path";
import fs from "fs/promises";
import ExcelJS from "exceljs";


const prismaClient = new PrismaClient();

/**
 * @Create Book Service
 */
const createBook = async (req: CreateBookRequest) => {
  const { book, category } = prismaClient;

  const bookAlreadyExist = await book.findUnique({
    where: {
      title: req.title,
    },
  });

  if (bookAlreadyExist) {
    throw new ResponseError(400, "This book already exist");
  }

  const categoryExist = await category.findUnique({
    where: {
      id: req.categoryId,
    },
  });

  if (!categoryExist) {
    throw new ResponseError(400, "No Category match");
  }

  await book.create({
    data: {
      title: req.title,
      author: req.author,
      coverImage: req.coverImage,
      categoryId: req.categoryId,
      stock:req.stock
    },
  });
};

/**
 * @Get Books Service
 */
interface GetBookParams {
  searchTitle?: string;
}

const getBook = async (params?: GetBookParams) => {
  const books = await prismaClient.book.findMany({
    where: params?.searchTitle
    ? {
        title: {
          contains: params.searchTitle,
        },
      }
    : undefined,
    select: {
      id: true,
      title: true,
      author: true,
      coverImage: true,
      stock: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  return books;
};

/**
 * @Get Book By Id Service
 */
const getBookById = async (id: string): Promise<Book> => {
  const book = await prismaClient.book.findUnique({
    where: {
      id,
    },
  });

  if (!book) {
    throw new ResponseError(404, "Book not found");
  }
  return book;
};

/**
 * @Get Detail Book Service
 */
const getDetailBook = async (id: string) => {
  const book = await prismaClient.book.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      author: true,
      coverImage: true,
      stock:true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!book) {
    throw new ResponseError(404, "Book not found");
  }
  return book;
};

/**
 * @Update Book Service
 */
const updateBook = async (update: UpdateBookRequest, id: string) => {
  const { book } = prismaClient;
  const bookFound = await book.findUnique({
    where: {
      id,
    },
  });

  if (!bookFound) {
    throw new ResponseError(404, "Book not found");
  }


  await book.update({
    where: {
      id,
    },
    data: update,
  });
};

/**
 * @Delete Book Service
 */
const deleteBook = async (id: string) => {
  const { book } = prismaClient;

  const bookExist = await book.findUnique({
    where: {
      id,
    },
  });

  if (!bookExist) {
    throw new ResponseError(404, "Book not found");
  }

  const imagePath = path.join(__dirname, "../../../public/images", bookExist.coverImage);
  try {
    await fs.access(imagePath);
    await fs.unlink(imagePath);
    await book.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    throw new Error(error as string);
  }
};



/**
 * @Download Books to Excel Service
 */
const downloadBooksToExcel = async () => {
  const books = await prismaClient.book.findMany({
    select: {
      id: true,
      title: true,
      author: true,
      stock: true,
      category: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!books.length) {
    throw new ResponseError(400,"No books available to download.");
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Books");

  worksheet.columns = [
    { header: "ID", key: "id", width: 30 },
    { header: "Title", key: "title", width: 50 },
    { header: "Author", key: "author", width: 30 },
    { header: "Stock", key: "stock", width: 15 },
    { header: "Category", key: "category", width: 25 },
  ];

  books.forEach((book) => {
    worksheet.addRow({
      id: book.id,
      title: book.title,
      author: book.author,
      stock: book.stock,
      category: book.category.name,
    });
  });

  const filePath = path.join(__dirname, "../../../public/reports", "books.xlsx");
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await workbook.xlsx.writeFile(filePath);

  return filePath;
};

export const booksService = {
  createBook,
  getBook,
  getBookById,
  updateBook,
  deleteBook,
  getDetailBook,
  downloadBooksToExcel,
};
