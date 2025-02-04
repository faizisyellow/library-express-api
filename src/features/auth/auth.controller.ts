import { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service";
import { CreateAuthUserRequest, LoginUserRequest } from "./auth.model";
import { loginValidate, signupValidate } from "./validation";

/**
 * @Signup Controller
 */
const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request = signupValidate.safeParse(req.body as CreateAuthUserRequest);

    if (!request.success) {
      res.status(400).json({
        status: "Failed",
        code: 400,
        message: `Validation failed error`,
        errors: request.error.flatten().fieldErrors,
      });
      return;
    }

    const { user } = await authService.signup(request.data);

    res.status(200).json({
      status: "Success",
      code: 200,
      message: "Sign up successful",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @Login Controller
 */
const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request = loginValidate.safeParse(req.body as LoginUserRequest);
    if (!request.success) {
      res.status(400).json({
        status: "Failed",
        code: 400,
        message: `Validation failed error`,
        errors: request.error.flatten().fieldErrors,
      });
      return;
    }
    const { userWithoutPassword: user, token,  } = await authService.login(request.data);

    res.cookie("x-auth", token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge:60 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: "Success",
      code: 200,
      data:{ user,token},
      message: "Login successful",
    });
  } catch (error) {
    next(error);
  }
};


/**
 * @Logout Controller
 */
const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie("x-auth", { httpOnly: true, secure: false });

    res.status(204).json({
      status: "Success",
      code: 204,
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
};

export const authController = { signup, login, logout};
