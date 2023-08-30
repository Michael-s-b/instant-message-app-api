import { MessageModel } from "../../models";

interface MessageService {
	getMessageList(chatId: any, userId: any): Promise<MessageModel[]>;
	createMessage(content: any, chatId: any, userId: any): Promise<MessageModel>;
	deleteMessage(messageId: any, userId: any): Promise<MessageModel>;
	editMessage(messageId: any, content: any, userId: any): Promise<MessageModel>;
}
export default MessageService;
