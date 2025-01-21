export type CreateAuthUserRequest = {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  photo?: string;
  role?: string;
};

export type LoginUserRequest = {
  email: string;
  password: string;
};

export type SignUpUserRespone = {
  user: { id: string; username: string; email: string; role: string };
  token :string
};

export type LoginResponse = {
  userWithoutPassword: { id: string; email: string; role: string };
  token: string;
};
