import { PrismaClient } from "@prisma/client";
import { ResponseError } from "../../utils/error/response.error";
import { CreateUserAdminRequest } from "./users.model";
import bcrypt from "bcryptjs";
import { jwtConfig } from "../../utils/jwt";
import path from "path";
import fs from "fs/promises";

const prismaClient = new PrismaClient();

/**
 * @Create User For Admin Service
 */
const createUserAdmin = async (req: CreateUserAdminRequest) => {
  const userAlreadyExist = await prismaClient.user.findUnique({
    where: {
      email: req.email,
    },
  });
  if (userAlreadyExist) {
    throw new ResponseError(400, "It seems already have an account, please log in instead.");
  }

  const hashedPassword = await bcrypt.hash(req.password, 10);

  const { id, email, username, role } = await prismaClient.user.create({
    data: {
      username: req.username,
      email: req.email,
      password: hashedPassword,
      role: "ADMIN",
      Profile: {
        create: {
          firstName: req.firstName,
          lastName: req.lastName,
          photo: req.photo,
        },
      },
    },
  });

  const token = jwtConfig.generateToken(id);

  const user = { id, email, username, role };
  return { user, token };
};

/**
 * @Get Users Service
 */
const getUsers = async () => {
  const users = await prismaClient.user.findMany({
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
    },
  });

  return users;
};

/**
 * @Get User By Id Service
 */
const getUserById = async (id: string) => {
  try {
    const userExist = await prismaClient.user.findUnique({
      where: {
        id,
      },
    });
    return userExist;
  } catch (error) {
    throw new ResponseError(404, "User not found");
  }
};

/**
 * @Delete User By Id Service
 */
const deleteUser = async (id: string) => {
  const { user } = prismaClient;
  try {
    const userExist = await user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        Profile: {
          select: {
            photo: true,
          },
        },
      },
    });

    if (!userExist) {
      throw new ResponseError(404, "User not found");
    }

    // If the user has a profile with a photo, delete the image
    if (userExist?.Profile?.photo) {
      const imagePath = path.join(__dirname, "../../../public/images", userExist?.Profile?.photo);
      try {
        await fs.access(imagePath);
        await fs.unlink(imagePath);
      } catch (error) {
        throw new Error(error as string);
      }
    }

    await user.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    throw new Error(error as string);
  }
};



/**
 * @GET User's Borrow Book
 */
const getMyborrow = async (id: string, status?: string) => {
  const myborrow = await prismaClient.user.findUnique({
    where: { id },
    select: {
      Borrowing: {
        where: {
          status: status || "borrowed", // Default status is "borrowed"
        },
        select: {
          id: true,
          borrowDate: true,
          returnDate: true,
          status: true,
          book: {
            select: {
              id: true,
              title: true,
              coverImage: true,
            },
          },
        },
      },
    },
  });

  return myborrow;
};


export const userService = {
  getUsers,
  getUserById,
  deleteUser,
  createUserAdmin,
  getMyborrow
};
