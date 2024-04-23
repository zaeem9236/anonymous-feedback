import { MessageInterface } from "@/model/Message.model";

export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean;
  messages?: Array<MessageInterface>;
}
