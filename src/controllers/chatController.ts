import { Request, Response } from "express";
import { chatService } from "../services";

const chatController = {
	getAllChats: async (req: Request, res: Response) => {
		try {
			const chatList = await chatService.getChatList(req.userId!);
			res.json({ data: chatList }).status(200);
		} catch (error: any) {
			return res.status(error.statusCode || 500).json({ error: error.message });
		}
	},
	createDirectChat: async (req: Request, res: Response) => {
		const { contactId } = req.body;
		try {
			const newChat = await chatService.createDirectChat(req.userId!, contactId);
			res.json({ data: newChat }).status(201);
		} catch (error: any) {
			return res.status(error.statusCode || 500).json({ error: error.message });
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
