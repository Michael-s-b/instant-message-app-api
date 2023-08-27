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
	async updateMessage(req: Request, res: Response) {},
	async deleteMessage(req: Request, res: Response) {},
};
export default messageController;
