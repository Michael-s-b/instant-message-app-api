import { Request, Response } from "express";
import { Chat, User } from "../models";
import { ChatType } from "../enums";

const chatController = {
	getAllChats: async (req: Request, res: Response) => {
		try {
			const allChats = await Chat.findMany({
				where: { users: { some: { userId: req.userId! } } },
				include: { users: { select: { userId: true } } },
			});
			res.json({ data: allChats }).status(200);
		} catch (error: any) {
			res.json({ error: error.message }).status(500);
		}
	},
	createDirectChat: async (req: Request, res: Response) => {
		const { contact } = req.body;

		try {
			if (!contact) {
				res.json({ error: "contact is required" }).status(401);
				return;
			}
			const contactFound = await User.findFirst({
				where: { OR: [{ username: contact }, { email: contact }] },
			});
			if (!contactFound) {
				res.json({ error: "Contact not found" }).status(404);
				return;
			}
			if (req.userId === contactFound.id) {
				res.json({ error: "Cannot create chat with yourself" }).status(401);
				return;
			}
			//check if a direct chat between these two users doesn't already exist
			const existingChat = await Chat.findFirst({
				where: {
					AND: [
						{ users: { some: { userId: req.userId! } } },
						{ users: { some: { userId: contactFound.id } } },
						{ type: ChatType[ChatType.DIRECT] },
					],
				},
			});
			if (existingChat) {
				res.json({ error: "A direct chat between given users already exist" }).status(200);
				return;
			}

			const newDirectChat = await Chat.create({
				data: {
					type: ChatType.DIRECT,
					users: {
						create: [{ userId: req.userId! }, { userId: contactFound.id }],
					},
				},
			});
			return res.json({ data: newDirectChat }).status(200);
		} catch (error: any) {
			res.json({ error: error.message }).status(500);
		}
	},
	createGroupChat: async (req: Request, res: Response) => {
		res.send("POST /chats/group");
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
