import { NextFunction, Request, Response } from "express";
import { categoryValidate } from "./validation";
import { categoriesService } from "./categories.service";

/**
 * @Create category controller
 */
const createCategoryController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request = categoryValidate.safeParse(req.body);

    if (!request.success) {
      res.status(400).json({
        status: "Failed",
        code: 400,
        message: "Validation failed error",
        errors: request.error.flatten().fieldErrors,
      });
      return;
    }

    await categoriesService.createCategory(request.data);

    res.status(201).json({
      status: "Success",
      code: 201,
      message: "Create category successful",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @Get category controller
 */
const getCategoryController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await categoriesService.getCategory();

    res.status(200).json({
      status: "Success",
      code: 200,
      data: categories,
      message: categories.length !== 0 ? "Get categories successful" : "No books found",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @Update category controller
 */
const updateCategoryController = async (req: Request, res: Response, next: NextFunction) => {
  const request = categoryValidate.safeParse(req.body);
  const { id } = req.params;

  if (!id) {
    res.status(400).json({
      status: "Failed",
      code: 400,
      error: "Category ID is required.",
    });
    return;
  }

  if (!request.success) {
    res.status(400).json({
      status: "Failed",
      code: 400,
      message: "Validation update category failed error",
      errors: request.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    await categoriesService.updateCategory({ ...request.data, id });
    res.status(200).json({
      status: "Success",
      code: 200,
      message: "Update category successful",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @Delete category controller
 */
const deleteCategoryController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({
      status: "Failed",
      code: 400,
      error: "Category ID is required.",
    });
    return;
  }

  try {
    await categoriesService.deleteCategory(id);
    res.status(204).json({
      status: "Success",
      code: 204,
      message: "Category delete successful",
    });
  } catch (error) {
    next(error);
  }
};

export const categoriesController = {
  createCategoryController,
  getCategoryController,
  updateCategoryController,
  deleteCategoryController,
};
