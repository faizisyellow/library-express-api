import express from "express";
import { categoriesController } from "./categories.controller";
import { authMiddleware } from "../../middleware/authenticate";
import { authorizationMiddleware } from "../../middleware/authorization";

export const categoriesRouter = express.Router();

const { authenticate } = authMiddleware;
const { authorize } = authorizationMiddleware;
const { createCategoryController, deleteCategoryController, getCategoryController, updateCategoryController } = categoriesController;

categoriesRouter.get("/api/v1/categories", authenticate, authorize(["ADMIN", "USER"]), getCategoryController);
categoriesRouter.post("/api/v1/categories", authenticate, authorize(["ADMIN"]), createCategoryController);
categoriesRouter.put("/api/v1/categories/:id", authenticate, authorize(["ADMIN"]), updateCategoryController);
categoriesRouter.delete("/api/v1/categories/:id", authenticate, authorize(["ADMIN"]), deleteCategoryController);
