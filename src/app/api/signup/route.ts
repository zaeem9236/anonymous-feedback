import dbConnect from "@/lib/dbConnect";
import { UserModel, UserInterface } from "@/model/User.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/emailTemplates/sendVerificationEmail";
import { request } from "http";
import { ApiResponse } from "@/types/ApiResponse";

export const POST = async (req: Request, res: Response): Promise<any> => {
  await dbConnect();
  try {
    const { username, email, password } = await req.json();

    const existingUserByUsername: any = await UserModel.findOne({
      username,
    });
    const existingUserByEmail: any = await UserModel.findOne({
      email,
    });
    console.log(existingUserByEmail, existingUserByUsername);
    if (existingUserByUsername?.isVerified || existingUserByEmail?.isVerified) {
      return Response.json(
        {
          success: false,
          message: "username or email already exists",
        },
        { status: 400 }
      );
    } else {
      console.log("else block");
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode: otp,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();
      await sendVerificationEmail({email, username, otp})
    }

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
