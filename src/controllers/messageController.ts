import { NextFunction, Request, Response } from "express";
import { MessageServicePrisma } from "../services";
import { MessageService } from "../services/interfaces";
import { HTTP_STATUS_CODE } from "../enums";
class MessageController {
	//GET api/messages
	public async getMessages(req: Request, res: Response, next: NextFunction) {
		const chatId = req.body.chatId;
		const userId = req.userId;
		let messageService: MessageService;
		try {
			messageService = new MessageServicePrisma();
			const messages = await messageService.getMessageList(chatId, userId);
			res.status(HTTP_STATUS_CODE.OK).json(messages);
		} catch (error: any) {
			next(error);
		}
	}
	//POST api/messages
	public async createMessage(req: Request, res: Response, next: NextFunction) {
		const { content, chatId } = req.body;
		const userId = req.userId;
		let messageService: MessageService;
		try {
			messageService = new MessageServicePrisma();
			const message = await messageService.createMessage(content, chatId, userId);
			res.status(HTTP_STATUS_CODE.CREATED).json(message);
		} catch (error: any) {
			next(error);
		}
	}
	//PUT api/messages/:id
	public async editMessage(req: Request, res: Response, next: NextFunction) {
		const { content } = req.body;
		const messageId = req.params.id;
		const userId = req.userId;
		let messageService: MessageService;
		try {
			messageService = new MessageServicePrisma();
			const editedMessage = await messageService.editMessage(messageId, content, userId);
			res.status(HTTP_STATUS_CODE.OK).json(editedMessage);
		} catch (error: any) {
			next(error);
		}
	}
	//DELETE api/messages/:id
	public async deleteMessage(req: Request, res: Response, next: NextFunction) {
		let messageService: MessageService;
		const messageId = req.params.id;
		const userId = req.userId;
		try {
			messageService = new MessageServicePrisma();
			const deletedMessage = await messageService.deleteMessage(messageId, userId);
			res.status(HTTP_STATUS_CODE.OK).json(deletedMessage);
		} catch (error: any) {
			next(error);
		}
	}
}
export default MessageController;
