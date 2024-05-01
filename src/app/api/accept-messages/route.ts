import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User.model";
import { z } from "zod";

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  if (!session || !session.user)
    return Response.json(
      {
        success: false,
        message: "not authenticated",
      },
      { status: 401 }
    );

  const userId = user._id;
  const { acceptMessage } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessage },
      { new: true }
    );
    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "failed to update user status to accept messages",
        },
        { status: 401 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "message acceptance status updated",
        updatedUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("failed to user status to except messages", error);
    return Response.json(
      {
        success: false,
        message: "failed to user status to except messages",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  if (!session || !session.user)
    return Response.json(
      {
        success: false,
        message: "not authenticatd",
      },
      { status: 500 }
    );

  const userId = user._id;
  try {
    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        isAcceptingMessage: foundUser.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("failed to user status to except messages", error);
    return Response.json(
      {
        success: false,
        message: "error in getting message acceptance status",
      },
      { status: 500 }
    );
  }
}
