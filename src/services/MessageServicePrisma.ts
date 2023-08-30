import createError from "http-errors";
import { MessageService } from "./interfaces";
import { PrismaClient } from "@prisma/client";
import { prismaClient } from "../database";

class MessageServicePrisma implements MessageService {
	private Chat;
	private Message;
	constructor() {
		// dependency injection
		this.Chat = prismaClient.chat;
		this.Message = prismaClient.message;
	}
	public async getMessageList(chatId: any, userId: any) {
		try {
			if (!chatId || !userId) throw createError(400, "Missing required fields");
			userId = Number.parseInt(userId);
			chatId = Number.parseInt(chatId);
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
	public async createMessage(content: any, chatId: any, userId: any) {
		try {
			chatId = Number.parseInt(chatId);
			userId = Number.parseInt(userId);
			if (!content || !chatId || !userId) throw createError(400, "Missing required fields");
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
				data: { content: content, userId: userId!, chatId: Number.parseInt(chatId) },
			});
			return message;
		} catch (error: any) {
			throw createError(error.statusCode || 500, error.message || "Internal server error");
		}
	}
	public async deleteMessage(messageId: any, userId: any) {
		try {
			if (!messageId || !userId) throw createError(400, "Missing required fields");
			userId = Number.parseInt(userId);
			messageId = Number.parseInt(messageId);
			const deletedMessage = await this.Message.update({
				data: { deleted: true, content: "" },
				where: { id: messageId, userId: userId },
			});
			if (!deletedMessage) throw createError(404, "Message not found");
			return deletedMessage;
		} catch (error: any) {
			throw createError(error.statusCode || 500, error.message || "Internal server error");
		}
	}
	public async editMessage(messageId: any, content: any, userId: any) {
		try {
			if (!messageId || !content || !userId) throw createError(400, "Missing required fields");
			userId = Number.parseInt(userId);
			messageId = Number.parseInt(messageId);
			const updatedMessage = await this.Message.update({
				data: { content: content, edited: true },
				where: { id: messageId, userId: userId },
			});
			if (!updatedMessage) throw createError(404, "Message not found");
			return updatedMessage;
		} catch (error: any) {
			throw createError(error.statusCode || 500, error.message || "Internal server error");
		}
	}
}
export default MessageServicePrisma;
