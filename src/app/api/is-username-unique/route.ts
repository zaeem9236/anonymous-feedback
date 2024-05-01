import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User.model";
import { usenameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";

const UsernameQuerySchema = z.object({
  username: usenameValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };
    const result = UsernameQuerySchema.safeParse(queryParam);
    if (!result.success)
      return Response.json(
        {
          success: false,
          message: `${result.error.format().username?._errors || []}`,
        },
        { status: 400 }
      );

    const { username } = result.data;
    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "username is already taken",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "username is unique",
      },
      { status: 400 }
    );
  } catch (error) {
    console.log("error checking username", error);
    return Response.json(
      {
        success: false,
        message: "error checking username",
      },
      { status: 500 }
    );
  }
}
