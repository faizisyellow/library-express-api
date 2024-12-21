import { z } from "zod";

export const categoryValidate = z.object({
  name: z.string(),
});
