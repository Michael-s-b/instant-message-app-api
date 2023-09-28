import { NextFunction, Request, Response } from "express";
import { MessageServicePrisma } from "../services";
import { MessageService } from "../services/interfaces";
import { HTTP_STATUS_CODE } from "../enums";
import {
	CreateMessageParamsSchema,
	DeleteMessageParamsSchema,
	EditMessageParamsSchema,
	GetMessageListParamsSchema,
} from "../services/interfaces/MessageService";
import { fromZodError } from "zod-validation-error";
import createError from "http-errors";
class MessageController {
	//GET api/messages
	public async getMessages(req: Request, res: Response, next: NextFunction) {
		const chatId = req.query.chatId;
		const limit = req.query.limit;
		const offset = req.query.offset;
		const userId = req.userId;
		let messageService: MessageService;
		const parsedParams = GetMessageListParamsSchema.safeParse({
			chatId: parseInt(chatId as string),
			userId,
			limit: limit ? parseInt(limit as string) : undefined,
			offset: offset ? parseInt(offset as string) : undefined,
		});
		try {
			if (!parsedParams.success) {
				throw createError(HTTP_STATUS_CODE.BAD_REQUEST, fromZodError(parsedParams.error).message);
			}
			messageService = new MessageServicePrisma();
			const messages = await messageService.getMessageList(parsedParams.data);
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
		const parsedParams = CreateMessageParamsSchema.safeParse({
			content,
			chatId: parseInt(chatId),
			userId,
		});
		try {
			if (!parsedParams.success) {
				throw createError(HTTP_STATUS_CODE.BAD_REQUEST, fromZodError(parsedParams.error).message);
			}
			messageService = new MessageServicePrisma();
			const message = await messageService.createMessage(parsedParams.data);
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
		const parsedParams = EditMessageParamsSchema.safeParse({
			messageId: parseInt(messageId),
			content,
			userId,
		});
		try {
			if (!parsedParams.success) {
				throw createError(HTTP_STATUS_CODE.BAD_REQUEST, fromZodError(parsedParams.error).message);
			}
			messageService = new MessageServicePrisma();
			const editedMessage = await messageService.editMessage(parsedParams.data);
			res.status(HTTP_STATUS_CODE.OK).json(editedMessage);
		} catch (error: any) {
			next(error);
		}
	}
	//DELETE api/messages/:id
	public async deleteMessage(req: Request, res: Response, next: NextFunction) {
		const messageId = req.params.id;
		const userId = req.userId;
		let messageService: MessageService;
		const parsedParams = DeleteMessageParamsSchema.safeParse({
			messageId: parseInt(messageId),
			userId,
		});
		try {
			if (!parsedParams.success) {
				throw createError(HTTP_STATUS_CODE.BAD_REQUEST, fromZodError(parsedParams.error).message);
			}
			messageService = new MessageServicePrisma();
			const deletedMessage = await messageService.deleteMessage(parsedParams.data);
			res.status(HTTP_STATUS_CODE.OK).json(deletedMessage);
		} catch (error: any) {
			next(error);
		}
	}
}
export default MessageController;
