import { Request, Response } from "express";
import { ChatService } from "../services/interfaces";
import { ChatServicePrisma } from "../services";

class ChatController {
	public async getAllChats(req: Request, res: Response) {
		let chatService: ChatService;
		try {
			chatService = new ChatServicePrisma();
			const chatList = await chatService.getChatList(req.userId!);
			res.json({ data: chatList }).status(200);
		} catch (error: any) {
			return res.status(error.statusCode || 500).json({ error: error.message });
		}
	}
	public async createDirectChat(req: Request, res: Response) {
		const { contactId } = req.body;
		let chatService: ChatService;
		try {
			chatService = new ChatServicePrisma();
			const newChat = await chatService.createDirectChat(req.userId!, contactId);
			res.json({ data: newChat }).status(201);
		} catch (error: any) {
			return res.status(error.statusCode || 500).json({ error: error.message });
		}
	}
	public async createGroupChat(req: Request, res: Response) {
		res.send("POST /chats/group");
	}
	public async deleteChat(req: Request, res: Response) {
		res.send("DELETE /chats/:id");
	}
}
export default ChatController;
