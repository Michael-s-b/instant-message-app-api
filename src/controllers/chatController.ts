import { Request, Response, NextFunction } from "express";
import { ChatService } from "../services/interfaces";
import { ChatServicePrisma } from "../services";
import { HTTP_STATUS_CODE } from "../enums";

class ChatController {
	//GET api/chats
	public async getAllChats(req: Request, res: Response, next: NextFunction) {
		let chatService: ChatService;
		const { includeUsers, includeMessages } = req.query;
		try {
			chatService = new ChatServicePrisma();
			const chatList = await chatService.getChatList({
				userId: req.userId!,
				includeUsers: includeUsers === "true",
				includeMessages: includeMessages === "true",
			});
			res.json(chatList).status(HTTP_STATUS_CODE.OK);
		} catch (error: any) {
			next(error);
		}
	}
	//POST api/chats/direct
	public async createDirectChat(req: Request, res: Response, next: NextFunction) {
		const { usernameOrEmail } = req.body;
		let chatService: ChatService;
		try {
			chatService = new ChatServicePrisma();
			const newChat = await chatService.createDirectChat({
				userId: req.userId!,
				usernameOrEmail: usernameOrEmail,
			});
			res.json({ data: newChat }).status(HTTP_STATUS_CODE.CREATED);
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
