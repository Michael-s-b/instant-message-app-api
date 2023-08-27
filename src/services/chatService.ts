import createError from "http-errors";
import { ChatType } from "../enums";
import { Chat, User } from "../models";
const chatService = {
	async getChatList(userId: any) {
		try {
			const chats = await Chat.findMany({
				where: { users: { some: { userId: userId! } } },
				include: { users: { select: { userId: true } }, messages: true },
			});
			return chats;
		} catch (error: any) {
			throw createError(error.statusCode || 500, error.message || "Internal server error");
		}
	},
	async createDirectChat(userId: any, contactId: any) {
		try {
			if (!contactId) {
				throw createError(401, "Contact is required");
			}
			const contactFound = await User.findFirst({
				where: { OR: [{ username: contactId }, { email: contactId }] },
			});
			if (!contactFound) {
				throw createError(404, "Contact not found");
			}
			if (userId === contactFound.id) {
				throw createError(401, "Cannot create chat with yourself");
			}
			//check if a direct chat between these two users doesn't already exist
			const existingChat = await Chat.findFirst({
				where: {
					AND: [
						{ users: { some: { userId: userId } } },
						{ users: { some: { userId: contactFound.id } } },
						{ type: ChatType[ChatType.DIRECT] },
					],
				},
			});
			if (existingChat) {
				throw createError(200, "A direct chat between given users already exist");
			}

			const newDirectChat = await Chat.create({
				data: {
					type: ChatType.DIRECT,
					users: {
						create: [{ userId: userId! }, { userId: contactFound.id }],
					},
				},
			});
			return newDirectChat;
		} catch (error: any) {
			throw createError(error.statusCode || 500, error.message || "Internal server error");
		}
	},
};
export default chatService;
