import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User.model";
import { z } from "zod";

import { MessageInterface } from "@/model/Message.model";

export async function POST(request: Request) {
  dbConnect();
  const { username, content } = await request.json();
  try {
    const user: any = UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        { status: 404 }
      );
    }

    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "user is not accepting messages",
        },
        { status: 403 }
      );
    }

    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage)
    await user.save()
    return Response.json(
        {
          success: true,
          message: "message sent successfully",
        },
        { status: 200 }
      );
  } catch (error) {}
}
