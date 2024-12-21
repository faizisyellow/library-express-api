import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { ResponseError } from "../../utils/error/response.error";
import { CreateAuthUserRequest, LoginResponse, LoginUserRequest, SignUpUserRespone } from "./auth.model";
import { jwtConfig } from "../../utils/jwt";

const prismaClient = new PrismaClient();

/**
 * @Signup service
 */
const signup = async (req: CreateAuthUserRequest): Promise<SignUpUserRespone> => {
  const userAlreadyExist = await prismaClient.user.findUnique({
    where: {
      email: req.email,
    },
  });
  if (userAlreadyExist) {
    throw new ResponseError(400, "It seems you already have an account, please log in instead.");
  }

  const hashedPassword = await bcrypt.hash(req.password, 10);

  const { id, email, username, role } = await prismaClient.user.create({
    data: {
      username: req.username,
      email: req.email,
      password: hashedPassword,
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
  const refreshToken = jwtConfig.generateRefreshToken(id);

  await prismaClient.refreshToken.create({
    data: {
      token: refreshToken,
      userId: id,
    },
  });

  const user = { id, email, username, role };
  return { user, token, refreshToken };
};

/**
 * @Login service
 */
const login = async (req: LoginUserRequest): Promise<LoginResponse> => {
  const user = await prismaClient.user.findUnique({
    where: { email: req.email },
    select: {
      id: true,
      email: true,
      role: true,
      password: true,
    },
  });
  if (!user) {
    throw new ResponseError(401, "It seems you dont an account, please sign up instead.");
  }

  const isMatch = await bcrypt.compare(req.password, user.password);
  if (!isMatch) {
    throw new ResponseError(400, "Incorrect password");
  }

  const token = jwtConfig.generateToken(user.id);

  const refreshToken = jwtConfig.generateRefreshToken(user.id);

  await prismaClient.refreshToken.deleteMany({
    where: { userId: user.id },
  });

  await prismaClient.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
    },
  });

  const { password, ...userWithoutPassword } = user;
  return { userWithoutPassword, token, refreshToken };
};

/**
 * @RefreshAccessToken service
 */
export const refreshAccessToken = async (refreshToken: string): Promise<{ token: string }> => {
  const decoded = jwtConfig.verifyRefreshToken(refreshToken);

  const tokenRecord = await prismaClient.refreshToken.findUnique({
    where: { token: refreshToken },
  });

  if (!tokenRecord) {
    throw new ResponseError(400, "Invalid refresh token");
  }

  const token = jwtConfig.generateToken(decoded.userId);

  return { token };
};

/**
 * To delete refresh token when expired
 * @InvalidateRefreshToken service
 */
const invalidateRefreshToken = async (refreshToken: string): Promise<void> => {
  try {
    await prismaClient.refreshToken.delete({
      where: {
        token: refreshToken,
      },
    });
  } catch (error) {
    throw new ResponseError(500, error as string);
  }
};

export const authService = {
  signup,
  login,
  refreshAccessToken,
  invalidateRefreshToken,
};
