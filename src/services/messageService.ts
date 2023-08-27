import { Chat, Message } from "../models";
import createError from "http-errors";

const messageService = {
	getMessageList: async (chatId: any, userId: any) => {
		try {
			if (!chatId || !userId) throw createError(400, "Missing required fields");
			userId = Number.parseInt(userId);
			chatId = Number.parseInt(chatId);
			const foundChat = await Chat.findFirst({
				where: { id: chatId, users: { some: { userId: userId } } },
				include: { messages: true, users: { select: { userId: true } } },
			});
			if (!foundChat) throw createError(401, "Either chat doesnt exist or user is not a participant");
			return foundChat.messages;
		} catch (error: any) {
			throw createError(error.statusCode || 500, error.message || "Internal server error");
		}
	},
	createMessage: async (content: any, chatId: any, userId: any) => {
		try {
			chatId = Number.parseInt(chatId);
			userId = Number.parseInt(userId);
			if (!content || !chatId || !userId) throw createError(400, "Missing required fields");
			const foundChat = await Chat.findUnique({
				where: { id: chatId },
				include: { users: { select: { userId: true } } },
			});
			if (!foundChat) throw createError(404, "Chat not found");
			// Check if user is a participant of the chat
			const isParticipant = foundChat.users.filter((user) => user.userId === userId);
			if (!isParticipant || isParticipant.length === 0) {
				throw createError(403, "Unauthorized, user does not belong to this chat");
			}

			const message = await Message.create({
				data: { content: content, userId: userId!, chatId: Number.parseInt(chatId) },
			});
			return message;
		} catch (error: any) {
			throw createError(error.statusCode || 500, error.message || "Internal server error");
		}
	},
};
export default messageService;
