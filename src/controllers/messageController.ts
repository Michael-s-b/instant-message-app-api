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
import { SuccessResponse } from "../types/SuccessResponse";
class MessageController {
	//GET api/messages
	public async getMessages(req: Request, res: Response, next: NextFunction) {
		const { timestamp, direction, chatId, limit } = req.query;
		const userId = req.userId;
		let messageService: MessageService;
		const parsedParams = GetMessageListParamsSchema.safeParse({
			chatId: parseInt(chatId as string),
			userId,
			limit: limit ? parseInt(limit as string) : undefined,
			// offset: offset ? parseInt(offset as string) : undefined,
			timestamp: timestamp ? new Date(timestamp as string) : undefined,
			direction: direction ? direction : undefined,
		});
		try {
			if (!parsedParams.success) {
				throw createError(HTTP_STATUS_CODE.BAD_REQUEST, fromZodError(parsedParams.error).message);
			}
			messageService = new MessageServicePrisma();
			const messages = await messageService.getMessageList(parsedParams.data);
			const responseBody: SuccessResponse<typeof messages> = {
				status: "success",
				message: "Successfully fetched messages",
				data: messages,
			};
			res.status(HTTP_STATUS_CODE.OK).json(responseBody);
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
			const responseBody: SuccessResponse<typeof message> = {
				status: "success",
				message: "Successfully created message",
				data: message,
			};
			res.status(HTTP_STATUS_CODE.CREATED).json(responseBody);
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
			const responseBody: SuccessResponse<typeof editedMessage> = {
				status: "success",
				message: "Successfully edited message",
				data: editedMessage,
			};
			res.status(HTTP_STATUS_CODE.OK).json(responseBody);
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
			const responseBody: SuccessResponse<typeof deletedMessage> = {
				status: "success",
				message: "Successfully deleted message",
				data: deletedMessage,
			};
			res.status(HTTP_STATUS_CODE.OK).json(responseBody);
		} catch (error: any) {
			next(error);
		}
	}
}
export default MessageController;
