import { z } from "zod";

export const signupValidate = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  firstName: z.string().min(3, "First must be at least 3 characters long"),
  lastName: z.string().min(3, "First must be at least 3 characters long"),
});

export const loginValidate = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string(),
});
