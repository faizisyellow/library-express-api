import express from "express";
import { profilesController } from "./profiles.controller";
import { authMiddleware } from "../../middleware/authenticate";
import { authorizationMiddleware } from "../../middleware/authorization";
import upload from "../../utils/upload";

export const profilesRouter = express.Router();

const { authenticate } = authMiddleware;
const { authorize } = authorizationMiddleware;

profilesRouter.get("/api/v1/profiles", authenticate, authorize(["ADMIN", "USER"]), profilesController.getProfileByIdController);
profilesRouter.patch("/api/v1/profiles", authenticate, authorize(["ADMIN", "USER"]), upload.single("photo"), profilesController.updateProfileController);
profilesRouter.delete("/api/v1/profiles/profiles-with-user", authenticate, authorize(["ADMIN", "USER"]), profilesController.deleteProfileWithUserController);
