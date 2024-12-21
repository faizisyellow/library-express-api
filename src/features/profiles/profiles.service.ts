import { PrismaClient } from "@prisma/client";
import { ResponseError } from "../../utils/error/response.error";
import { UpdateProfileRequest } from "./profiles.model";
import path from "path";
import fs from "fs/promises";

const prismaClient = new PrismaClient();

/**
 * @Get Profile By Id service
 */
const getProfileById = async (id: string) => {
  try {
    const profile = await prismaClient.profile.findUnique({
      where: {
        userId: id,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        photo: true,
        user: {
          select: {
            id: true,
            email: true,
            username: true,
          },
        },
      },
    });

    return profile;
  } catch (error) {
    throw new ResponseError(404, "Profile not found");
  }
};

/**
 * @Update Profile service
 */
const updateProfile = async (update: UpdateProfileRequest, id: string) => {
  try {
    await prismaClient.profile.update({
      where: {
        userId: id,
      },
      data: {
        firstName: update.firstName || undefined,
        lastName: update.lastName || undefined,
        photo: update.photo || undefined,
        user: {
          update: {
            username: update.username || undefined,
          },
        },
      },
    });
  } catch (error) {
    throw new Error(error as string);
  }
};

/**
 * @Delete profile service
 */
const deleteProfileWithUser = async (id: string) => {
  try {
    const userWithProfileExist = await prismaClient.user.findUnique({
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

    // If the user has a profile with a photo, delete the image
    if (userWithProfileExist?.Profile?.photo) {
      const imagePath = path.join(__dirname, "../../../public/images", userWithProfileExist?.Profile?.photo);

      try {
        await fs.access(imagePath);
        await fs.unlink(imagePath);
      } catch (error) {
        throw new Error(error as string);
      }
    }

    await prismaClient.$transaction(async (prisma) => {
      await prisma.user.delete({
        where: {
          id,
        },
      });
    });
  } catch (error) {
    throw new Error(error as string);
  }
};

export const profilesService = {
  getProfileById,
  updateProfile,
  deleteProfileWithUser,
};
