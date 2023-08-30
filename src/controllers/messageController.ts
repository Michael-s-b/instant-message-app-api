import { Request, Response } from "express";
import { MessageServicePrisma } from "../services";
import { MessageService } from "../services/interfaces";
class MessageController {
	public async getMessages(req: Request, res: Response) {
		const chatId = req.body.chatId;
		const userId = req.userId;
		let messageService: MessageService;
		try {
			messageService = new MessageServicePrisma();
			const messages = await messageService.getMessageList(chatId, userId);
			res.status(200).json(messages);
		} catch (error: any) {
			return res.status(error.statusCode || 500).json({ error: error.message });
		}
	}
	public async createMessage(req: Request, res: Response) {
		const { content, chatId } = req.body;
		const userId = req.userId;
		let messageService: MessageService;
		try {
			messageService = new MessageServicePrisma();
			const message = await messageService.createMessage(content, chatId, userId);
			res.status(201).json(message);
		} catch (error: any) {
			return res.status(error.statusCode || 500).json({ error: error.message });
		}
	}
	public async editMessage(req: Request, res: Response) {
		const { content } = req.body;
		const messageId = req.params.id;
		const userId = req.userId;
		let messageService: MessageService;
		try {
			messageService = new MessageServicePrisma();
			const editedMessage = await messageService.editMessage(messageId, content, userId);
			res.status(200).json(editedMessage);
		} catch (error: any) {
			return res.status(error.statusCode || 500).json({ error: error.message });
		}
	}
	public async deleteMessage(req: Request, res: Response) {
		let messageService: MessageService;
		const messageId = req.params.id;
		const userId = req.userId;
		try {
			messageService = new MessageServicePrisma();
			const deletedMessage = await messageService.deleteMessage(messageId, userId);
			res.status(200).json(deletedMessage);
		} catch (error: any) {
			return res.status(error.statusCode || 500).json({ error: error.message });
		}
	}
}
export default MessageController;
