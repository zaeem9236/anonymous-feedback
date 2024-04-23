import mongoose, { Schema, Document, mongo } from "mongoose";
import { MessageInterface, MessageSchema } from "./Message.model";

export interface UserInterface extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  messages: MessageInterface[];
}

const UserSchema: Schema<UserInterface> = new Schema({
  username: {
    type: String,
    required: [true, "username is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    match: [/.+\@.+\..+/, "invalid email"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  verifyCode: {
    type: String,
    required: [true, "verify code is required"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "password is required"],
  },
  isVerified: {
    type: Boolean,
    required: false,
  },
  isAcceptingMessage: {
    type: Boolean,
    required: true,
  },
  messages: [MessageSchema],
});

export const UserModel =
  (mongoose.models.User as mongoose.Model<UserInterface>) ||
  mongoose.model<UserInterface>("User", UserSchema);
