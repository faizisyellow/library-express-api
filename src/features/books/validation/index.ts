import z from "zod";

export const createBookValidate = z.object({
  title: z.string().min(3, "title must be at least 3 characters long"),
  author: z.string().min(3, "author must be at least 3 characters long"),
  categoryId: z.string(),
});
