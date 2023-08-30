import { ChatModel } from "../../models";

interface ChatService {
	getChatList(userId: string | undefined | number): Promise<ChatModel[]>;
	createDirectChat(userId: any, contactId: any): Promise<ChatModel>;
}
export default ChatService;
