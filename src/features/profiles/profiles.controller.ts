import { NextFunction, Request, Response } from "express";
import { profilesService } from "./profiles.service";
import { UpdateProfileRequest } from "./profiles.model";
import { ResponseError } from "../../utils/error/response.error";

/**
 * @Get Profile By Id Controller
 */
const getProfileByIdController = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.userId;
  const profile = await profilesService.getProfileById(id!);

  res.status(200).json({
    status: "Success",
    code: 200,
    data: profile,
    message: "Get profile successful",
  });
};

/**
 * @Update Profile Controller
 */
const updateProfileController = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.userId as string;
  const photo = req.file?.originalname;

  try {
    /**
     * If the photo field is optional:
     * - If no photo is uploaded, remove the field from the request.
     * - If an photo is uploaded, include it in the request.
     */
    const update: UpdateProfileRequest = { ...req.body, ...(photo ? { photo } : {}) };

    await profilesService.updateProfile(update, id);
    res.status(200).json({
      status: "Success",
      code: 200,
      message: "Update profile successful",
    });
  } catch (error) {
    throw new ResponseError(400, error as string);
  }
};

/**
 * @Delete Profile Controller
 */
const deleteProfileWithUserController = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.userId;
  try {
    await profilesService.deleteProfileWithUser(id as string);

    res.clearCookie("token", { httpOnly: true, secure: false });
    res.clearCookie("refresh_token", { httpOnly: true, secure: false });

    res.status(200).json({
      status: "Success",
      code: 200,
      message: "Delete profile successful",
    });
  } catch (error) {
    throw new ResponseError(500, error as string);
  }
};

export const profilesController = {
  getProfileByIdController,
  updateProfileController,
  deleteProfileWithUserController,
};
