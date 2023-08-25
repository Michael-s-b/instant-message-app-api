import { Request, Response } from "express";
import { Chat } from "../models";
import { ChatType } from "../enums";
import { parseStringToChatTypeEnum } from "../util";

const chatController = {
	getAllChats: async (req: Request, res: Response) => {
		const allChats = await Chat.findMany({ include: { users: { select: { userId: true } } } });
		res.json({ data: allChats }).status(200);
	},
	createChat: async (req: Request, res: Response) => {
		const { userId1, userId2, chatType } = req.body;

		try {
			if (userId1 === userId2) {
				res.json({ error: "Cannot create chat with yourself" }).status(401);
				return;
			}
			if (parseStringToChatTypeEnum(chatType) === ChatType.DIRECT) {
				//check if a direct chat between these two users doesn't already exist
				const existingChat = await Chat.findFirst({
					where: {
						AND: [
							{ users: { some: { userId: Number.parseInt(userId1) } } },
							{ users: { some: { userId: Number.parseInt(userId2) } } },
							{ type: ChatType[ChatType.DIRECT] },
						],
					},
				});
				console.log(existingChat);
				if (existingChat) {
					res.json({ error: "A direct chat between given users already exist" }).status(200);
					return;
				}
			}
			const newPrivateChat = await Chat.create({
				data: {
					type: parseStringToChatTypeEnum(chatType),
					users: {
						create: [{ userId: Number.parseInt(userId1) }, { userId: Number.parseInt(userId2) }],
					},
				},
			});
			return res.json({ data: newPrivateChat }).status(200);
		} catch (error: any) {
			res.json({ error: error.message }).status(500);
		}
	},
	getChatById: async (req: Request, res: Response) => {
		res.send("GET /chats/:id");
	},
	updateChat: async (req: Request, res: Response) => {
		res.send("PUT /chats/:id");
	},
	deleteChat: async (req: Request, res: Response) => {
		res.send("DELETE /chats/:id");
	},
};
export default chatController;
