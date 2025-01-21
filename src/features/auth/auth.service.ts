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
  const user = { id, email, username, role };
  return {user,token};
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

  const { password, ...userWithoutPassword } = user;
  return { userWithoutPassword, token,  };
};



export const authService = {
  signup,
  login,
};
