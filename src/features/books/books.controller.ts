import { NextFunction, Request, Response } from "express";
import { createBookValidate } from "./validation";
import { booksService } from "./books.service";
import { CreateBookRequest, UpdateBookRequest } from "./books.model";

/**
 * @Create Book controller
 */
const createBookController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request = createBookValidate.safeParse(req.body);

    /**
     * When use multipart form:
     *  -Manually validate request from req.body.
     *  -Manually validate request from req.file.
     */
    const coverImage = req.file?.originalname;
    const { title, author, categoryId,stock } = req.body;
    let stockConvertNumber;
    if (typeof stock === "string") {
     stockConvertNumber = Number(stock)
    }

    

    if (!title || !author || !categoryId || !coverImage || !stockConvertNumber) {
      res.status(400).json({
        status: "Failed",
        message: "Validation failed on create book invalid error",
        errors: {
          title: title ? undefined : "Title is required",
          author: author ? undefined : "Author is required",
          categoryId: categoryId ? undefined : "Category ID is required",
          coverImage: coverImage ? undefined : "Cover Image is required",
          stock: stockConvertNumber ? undefined : "Stock is required",
        },
      });
      return;
    }

    if (!request.success) {
      res.status(400).json({
        status: "Failed",
        code: 400,
        message: "Validation on create book invalid error",
        errors: request.error.flatten().fieldErrors,
      });
      return;
    }

    // what am i doing here
    await booksService.createBook({ ...request.data,stock:stockConvertNumber, coverImage } as CreateBookRequest);

    res.status(201).json({
      status: "Success",
      code: 201,
      message: "Create book successful",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @Get Books controller
 */
const getBookController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const books = await booksService.getBook();
    res.status(200).json({
      status: "Success",
      code: 200,
      data: books,
      message: "Get books successful",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @Get Book controller
 */
const getBookByIdController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const book = await booksService.getDetailBook(id);
    res.status(200).json({
      status: "Success",
      code: 200,
      data: book,
      message: "Get book successful",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @Update Book controller
 */
const updateBookController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const coverImage = req.file?.originalname;

  try {
    /**
     * If the image field is optional:
     * - If no image is uploaded, remove the field from the request.
     * - If an image is uploaded, include it in the request.
     */
    const request: UpdateBookRequest = { ...req.body,stock:Number(req.body?.stock), ...(coverImage ? { coverImage } : {}) };

    const book = await booksService.getBookById(id);

    const hasChanges =
      Object.keys(request).length > 0 &&
      Object.keys(request).some((key) => {
        const typedKey = key as keyof UpdateBookRequest;
        return request[typedKey] !== book[typedKey];
      });

    if (!hasChanges) {
      res.status(200).json({
        status: "Success",
        code: 200,
        message: "No changes were made. The book is already up-to-date.",
      });
      return;
    }

    await booksService.updateBook(request, id);

    res.status(200).json({
      status: "Success",
      code: 200,
      message: "Update book successful",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @Delete Book controller
 */
const deleteBookController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    await booksService.deleteBook(id);
    res.status(200).json({
      status: "Success",
      code: 200,
      message: "Book delete successful",
    });
  } catch (error) {
    next(error);
  }
};

export const booksController = {
  createBookController,
  getBookController,
  updateBookController,
  deleteBookController,
  getBookByIdController,
};
