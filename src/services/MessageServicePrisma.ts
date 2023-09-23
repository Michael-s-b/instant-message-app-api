import createError from "http-errors";
import { MessageService } from "./interfaces";
import { prismaClient } from "../database";
import {
	CreateMessageParams,
	DeleteMessageParams,
	EditMessageParams,
	GetMessageListParams,
} from "./interfaces/MessageService";
import { HTTP_STATUS_CODE } from "../enums";

class MessageServicePrisma implements MessageService {
	private Chat;
	private Message;
	constructor() {
		// dependency injection
		this.Chat = prismaClient.chat;
		this.Message = prismaClient.message;
	}
	public async getMessageList(params: GetMessageListParams) {
		const { chatId, userId } = params;
		try {
			const foundChat = await this.Chat.findFirst({
				where: { id: chatId, users: { some: { userId: userId } } },
				include: { messages: true, users: { select: { userId: true } } },
			});
			if (!foundChat) throw createError(401, "Either chat doesnt exist or user is not a participant");
			return foundChat.messages;
		} catch (error: any) {
			throw createError(error.statusCode || 500, error.message || "Internal server error");
		}
	}
	public async createMessage(params: CreateMessageParams) {
		const { content, chatId, userId } = params;
		try {
			const foundChat = await this.Chat.findUnique({
				where: { id: chatId },
				include: { users: { select: { userId: true } } },
			});
			if (!foundChat) throw createError(404, "Chat not found");
			// Check if user is a participant of the chat
			const isParticipant = foundChat.users.filter((user) => user.userId === userId);
			if (!isParticipant || isParticipant.length === 0) {
				throw createError(403, "Unauthorized, user does not belong to this chat");
			}

			const message = await this.Message.create({
				data: { content: content, userId: userId!, chatId: chatId },
			});
			return message;
		} catch (error: any) {
			throw createError(error.statusCode || 500, error.message || "Internal server error");
		}
	}
	public async deleteMessage(params: DeleteMessageParams) {
		const { messageId, userId } = params;
		try {
			const foundMessage = await this.Message.findFirst({
				where: { id: messageId, userId: userId },
			});
			if (!foundMessage) throw createError(HTTP_STATUS_CODE.NOT_FOUND, "Message not found");
			const deletedMessage = await this.Message.update({
				data: { deleted: true, content: "" },
				where: { id: messageId, userId: userId },
			});
			return deletedMessage;
		} catch (error: any) {
			throw createError(error.statusCode || 500, error.message || "Internal server error");
		}
	}
	public async editMessage(params: EditMessageParams) {
		const { messageId, content, userId } = params;
		try {
			const foundMessage = await this.Message.findFirst({
				where: { id: messageId, userId: userId },
			});
			if (!foundMessage) throw createError(HTTP_STATUS_CODE.NOT_FOUND, "Message not found");
			const updatedMessage = await this.Message.update({
				data: { content: content, edited: true },
				where: { id: messageId, userId: userId },
			});
			return updatedMessage;
		} catch (error: any) {
			throw createError(error.statusCode || 500, error.message || "Internal server error");
		}
	}
}
export default MessageServicePrisma;
