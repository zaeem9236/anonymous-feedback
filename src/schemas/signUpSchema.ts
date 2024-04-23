import { z } from "zod";

export const usenameValidation = z
  .string()
  .min(2, "username must contain atleast 2 characters")
  .max(20, "username can not contain more than 20 characters");

export const signUpSchema = z.object({
  username: usenameValidation,
  email: z.string().email({ message: "invalid email address" }),
  password: z
    .string()
    .min(6, { message: "password must contain atleast 6 characters" }),
});
