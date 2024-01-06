import { Request, Response, NextFunction } from "express";
import { ChatService } from "../services/interfaces";
import { ChatServicePrisma } from "../services";
import { HTTP_STATUS_CODE } from "../enums";
import { CreateDirectChatParamsSchema, GetChatListParamsSchema } from "../services/interfaces/ChatService";
import createError from "http-errors";
import { fromZodError } from "zod-validation-error";
import { type SuccessResponse } from "../types/SuccessResponse";

class ChatController {
	//GET api/chats
	public async getAllChats(req: Request, res: Response, next: NextFunction) {
		let chatService: ChatService;
		const { includeUsers, includeMessages, messagesLimit } = req.query;
		const parsedParams = GetChatListParamsSchema.safeParse({
			userId: req.userId,
			includeUsers: includeUsers === "true",
			includeMessages: includeMessages === "true",
			messagesLimit: Number.parseInt(messagesLimit as string) || 1,
		});
		try {
			if (!parsedParams.success) {
				throw createError(HTTP_STATUS_CODE.BAD_REQUEST, fromZodError(parsedParams.error).message);
			}
			chatService = new ChatServicePrisma();
			const chatList = await chatService.getChatList({
				userId: req.userId!,
				includeUsers: includeUsers === "true",
				includeMessages: includeMessages === "true",
				messagesLimit: parsedParams.data.messagesLimit,
			});
			const responseBody: SuccessResponse<typeof chatList> = {
				status: "success",
				message: "Successfully fetched chat list",
				data: chatList,
			};
			return res.json(responseBody).status(HTTP_STATUS_CODE.OK);
		} catch (error: any) {
			next(error);
		}
	}
	//POST api/chats/direct
	public async createDirectChat(req: Request, res: Response, next: NextFunction) {
		const { usernameOrEmail } = req.body;
		let chatService: ChatService;
		const parsedParams = CreateDirectChatParamsSchema.safeParse({ userId: req.userId, usernameOrEmail });
		try {
			if (!parsedParams.success) {
				throw createError(HTTP_STATUS_CODE.BAD_REQUEST, fromZodError(parsedParams.error).message);
			}
			chatService = new ChatServicePrisma();
			const newChat = await chatService.createDirectChat({
				userId: req.userId!,
				usernameOrEmail: usernameOrEmail,
			});
			const responseBody: SuccessResponse<typeof newChat> = {
				status: "success",
				message: "Successfully created chat",
				data: newChat,
			};
			return res.json(responseBody).status(HTTP_STATUS_CODE.CREATED);
		} catch (error: any) {
			next(error);
		}
	}
	//POST api/chats/group
	public async createGroupChat(req: Request, res: Response, next: NextFunction) {
		res.send("POST /chats/group");
	}
	//DELETE api/chats/:id
	public async deleteChat(req: Request, res: Response, next: NextFunction) {
		res.send("DELETE /chats/:id");
	}
}
export default ChatController;
