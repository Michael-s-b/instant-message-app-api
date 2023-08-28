import { Request, Response } from "express";
import messageService from "../services/messageService";
const messageController = {
	async getMessages(req: Request, res: Response) {
		const chatId = req.body.chatId;
		const userId = req.userId;
		try {
			const messages = await messageService.getMessageList(chatId, userId);
			res.status(200).json(messages);
		} catch (error: any) {
			return res.status(error.statusCode || 500).json({ error: error.message });
		}
	},
	async createMessage(req: Request, res: Response) {
		const { content, chatId } = req.body;
		const userId = req.userId;
		try {
			const message = await messageService.createMessage(content, chatId, userId);
			res.status(201).json(message);
		} catch (error: any) {
			return res.status(error.statusCode || 500).json({ error: error.message });
		}
	},
	async editMessage(req: Request, res: Response) {
		const { content } = req.body;
		const messageId = req.params.id;
		const userId = req.userId;
		try {
			const editedMessage = await messageService.editMessage(messageId, content, userId);
			res.status(200).json(editedMessage);
		} catch (error: any) {
			return res.status(error.statusCode || 500).json({ error: error.message });
		}
	},
	async deleteMessage(req: Request, res: Response) {
		const messageId = req.params.id;
		const userId = req.userId;
		try {
			const deletedMessage = await messageService.deleteMessage(messageId, userId);
			res.status(200).json(deletedMessage);
		} catch (error: any) {
			return res.status(error.statusCode || 500).json({ error: error.message });
		}
	},
};
export default messageController;
