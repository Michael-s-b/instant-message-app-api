import { z } from "zod";
import { ChatModel } from "../../models";
export const CreateDirectChatParamsSchema = z.object({
	userId: z.number(),
	usernameOrEmail: z.string().trim().min(3),
});
export const GetChatListParamsSchema = z.object({
	userId: z.number(),
	includeMessages: z.boolean(),
	includeUsers: z.boolean(),
});
export type GetChatListParams = z.infer<typeof GetChatListParamsSchema>;
export type CreateDirectChatParams = z.infer<typeof CreateDirectChatParamsSchema>;
interface ChatService {
	getChatList(params: GetChatListParams): Promise<ChatModel[]>;
	createDirectChat(params: CreateDirectChatParams): Promise<ChatModel>;
}
export default ChatService;
