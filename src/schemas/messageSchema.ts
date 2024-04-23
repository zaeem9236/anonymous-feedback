import { z } from "zod";

export const messageSchema = z.object({
  content: z.string()
  .min(15, {message: 'content must contain atleast 15 characters'})
  .min(300, {message: 'content must be no longer than 300 characters'})
});
