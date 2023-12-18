import createError from "http-errors";
import { ChatType, HTTP_STATUS_CODE } from "../enums";
import { ChatService } from "./interfaces";
import { prismaClient } from "../database";
import { Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import z from "zod";
import { type CreateDirectChatParams, GetChatListParams } from "./interfaces/ChatService";
type ChatIncludeOptions = {} & Prisma.ChatInclude<DefaultArgs>;

class ChatServicePrisma implements ChatService {
	private User;
	private Chat;
	constructor() {
		// dependency injection
		this.User = prismaClient.user;
		this.Chat = prismaClient.chat;
	}

	public async getChatList(params: GetChatListParams) {
		const { userId, includeMessages, includeUsers, messagesLimit } = params;
		const include: ChatIncludeOptions = {
			users: includeUsers ? { select: { user: { select: { id: true, username: true } } } } : false,
			messages: includeMessages
				? {
						take: messagesLimit, // the amount of messages to take
						orderBy: { createdAt: "desc" }, // Order by creation date in descending order
				  }
				: false,
		};
		try {
			const chats = await this.Chat.findMany({
				where: { users: { some: { userId: userId! } } },
				include: include,
			});
			return chats;
		} catch (error: any) {
			throw createError(error.statusCode || 500, error.message || "Internal server error");
		}
	}
	public async createDirectChat(params: CreateDirectChatParams) {
		const { userId, usernameOrEmail } = params;
		try {
			const contactFound = await this.User.findFirst({
				where: { OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }] },
			});
			if (!contactFound) {
				throw createError(404, "Contact not found");
			}
			if (userId === contactFound.id) {
				throw createError(HTTP_STATUS_CODE.BAD_REQUEST, "Cannot create chat with yourself");
			}
			//check if a direct chat between these two users doesn't already exist
			const existingChat = await this.Chat.findFirst({
				where: {
					AND: [
						{ users: { some: { userId: userId } } },
						{ users: { some: { userId: contactFound.id } } },
						{ type: ChatType[ChatType.DIRECT] },
					],
				},
			});
			if (existingChat) {
				throw createError(HTTP_STATUS_CODE.BAD_REQUEST, "A direct chat between given users already exist");
			}

			const newDirectChat = await this.Chat.create({
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
	}
}
export default ChatServicePrisma;
