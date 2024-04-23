import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/emailTemplates/sendVerificationEmail";
import { request } from "http";
import { ApiResponse } from "@/types/ApiResponse";

export const POST = async (req: Request, res: Response): Promise<any> => {
  await dbConnect()
  try {
    const { username, email, passwod } = await req.json();
    const existingUser = await UserModel.findOne({
      username,
      isVerified: true,
    });
    return Response.json(
      { success: true, message: "user registered successfully" },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("error registering user", error);

    return Response.json(
      { success: false, message: "error on registering user" },
      {
        status: 500,
      }
    );
  }
};
