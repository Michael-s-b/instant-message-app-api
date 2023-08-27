import { Message } from "../models";
import { Request, Response } from "express";
const messageController = {
	async getMessages(req: Request, res: Response) {},
	async createMessage(req: Request, res: Response) {
		const { content, chatId } = req.body;
		const userId = req.userId;
		try {
			const message = await Message.create({
				data: { content: content, userId: userId!, chatId: Number.parseInt(chatId) },
			});
			return res.status(201).json({ data: message });
		} catch (error: any) {
			return res.status(500).json({ error: error.message });
		}
	},
	async updateMessage(req: Request, res: Response) {},
	async deleteMessage(req: Request, res: Response) {},
};
export default messageController;
