import { ChatModel } from "../../models";
export type GetChatListParams = {
	userId: number;
	includeUsers: boolean;
	includeMessages: boolean;
};
export type CreateDirectChatParams = {
	userId: number;
	usernameOrEmail: string;
};
interface ChatService {
	getChatList(params: GetChatListParams): Promise<ChatModel[]>;
	createDirectChat(params: CreateDirectChatParams): Promise<ChatModel>;
}
export default ChatService;
