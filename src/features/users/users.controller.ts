import { NextFunction, Request, Response } from "express";
import { userService } from "./users.service";
import { createUserAdminValidate } from "./validation";
import { CreateUserAdminRequest } from "./users.model";

const createUserAdminController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request = createUserAdminValidate.safeParse(req.body as CreateUserAdminRequest);

    if (!request.success) {
      res.status(400).json({
        status: "Failed",
        code: 400,
        message: `Validation failed error`,
        errors: request.error.flatten().fieldErrors,
      });
      return;
    }

    const { user, token, } = await userService.createUserAdmin(request.data);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 3600 * 1000,
    });

    res.status(200).json({
      status: "Success",
      code: 200,
      message: "Create admin successful",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

const getUsersController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.getUsers();

    res.status(200).json({
      status: "Success",
      code: 200,
      data: users,
      message: "Get users succcessful",
    });
  } catch (error) {
    next(error);
  }
};

const deleteUserController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    await userService.deleteUser(id);

    res.status(204).json({
      status: "Success",
      code: 200,
      message: "Delete user successful",
    });
  } catch (error) {
    next(error);
  }
};

const getMyborrowController = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.userId!;
  const { status } = req.query; // Query parameter to filter status
  
  try {
    const myBorrows = await userService.getMyborrow(id, status as string);
    
    res.status(200).json({
      status: "Success",
      code: 200,
      data: myBorrows,
      message: "Get borrowing book successful",
    });
  } catch (error) {
    next(error);
  }
};

export const userController = {
  deleteUserController,
  createUserAdminController,
  getUsersController,
  getMyborrowController
};
