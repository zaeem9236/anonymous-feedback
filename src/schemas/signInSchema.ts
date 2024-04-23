import { z } from "zod";

export const signInSchema = z.object({
  identifier: z.string(), // identifier means username or email
  password: z.string(),
});
