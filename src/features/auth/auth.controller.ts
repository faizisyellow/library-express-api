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

    const { user, token, refreshToken } = await authService.signup(request.data);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 3600 * 1000,
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

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
    const { userWithoutPassword: user, token, refreshToken } = await authService.login(request.data);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 3600 * 1000,
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: "Success",
      code: 200,
      data: user,
      message: "Login successful",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @Refresh Controller
 */
const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refresh_token as string;

    if (!refreshToken) {
      res.status(400).json({
        status: "Failed",
        code: 400,
        message: "Refresh token missing",
      });
      return;
    }

    const { token } = await authService.refreshAccessToken(refreshToken);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 3600 * 1000,
    });

    res.status(200).json({
      status: "Success",
      code: 200,
      message: "Access token refreshed",
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
    const refreshToken = req.cookies.refresh_token;
    if (refreshToken) {
      await authService.invalidateRefreshToken(refreshToken);
    }

    res.clearCookie("token", { httpOnly: true, secure: false });
    res.clearCookie("refresh_token", { httpOnly: true, secure: false });

    res.status(204).json({
      status: "Success",
      code: 204,
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
};

export const authController = { signup, login, logout, refreshToken };
