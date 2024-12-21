import { Category, PrismaClient } from "@prisma/client";
import { CreateCategoryRequest, GetCategoryResponse, UpdateCategoryRequest } from "./categories.model";
import { ResponseError } from "../../utils/error/response.error";
import path from "path";
import fs from "fs/promises";

const prismaClient = new PrismaClient();

/**
 * @Create category service
 */
const createCategory = async (req: CreateCategoryRequest) => {
  const { category } = prismaClient;

  const categoryExist = await category.findUnique({
    where: {
      name: req.name,
    },
  });

  if (categoryExist) {
    throw new ResponseError(400, "This category already exist");
    return;
  }

  await category.create({
    data: {
      name: req.name,
    },
  });
};

/**
 * @Get category service
 */
const getCategory = async (): Promise<GetCategoryResponse[]> => {
  const category: GetCategoryResponse[] = await prismaClient.category.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return category;
};

/**
 * @Update category service
 */
const updateCategory = async (req: UpdateCategoryRequest) => {
  const { category } = prismaClient;

  const checkCategory = await category.findUnique({
    where: {
      id: req.id,
    },
  });

  if (!checkCategory) {
    throw new ResponseError(404, "Category not found");
  }

  const nameAlreadyExist = await category.findUnique({
    where: {
      name: req.name,
    },
  });

  if (nameAlreadyExist) {
    throw new ResponseError(400, "New category must be different");
  }

  try {
    await category.update({
      where: {
        id: req.id,
      },
      data: {
        name: req.name,
      },
    });
  } catch (error) {
    throw new ResponseError(500, error as string);
  }
};

/**
 * @Delete category service
 */
const deleteCategory = async (id: string) => {
  const { category } = prismaClient;

  const checkCategory = await category.findUnique({
    where: {
      id,
    },
    include: {
      books: true,
    },
  });

  if (!checkCategory) {
    throw new ResponseError(404, "Category not found");
  }

  try {
    // Remove all book's cover image.
    for (let i = 0; i < checkCategory?.books.length!; i++) {
      const imagePath = path.join(__dirname, "../../../public/images", checkCategory?.books[i].coverImage!);
      await fs.access(imagePath);
      await fs.unlink(imagePath);
    }

    await category.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    throw new ResponseError(500, error as string);
  }
};
export const categoriesService = {
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
};
