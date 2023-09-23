import { MessageModel } from "../../models";
import z from "zod";

export const GetMessageListParamsSchema = z.object({
	chatId: z.number({
		invalid_type_error: "ChatId is requiered and must be a number",
		required_error: "ChatId is requiered",
	}),
	userId: z.number(),
});
export type GetMessageListParams = z.infer<typeof GetMessageListParamsSchema>;

export const CreateMessageParamsSchema = z.object({
	content: z
		.string({ invalid_type_error: "Content must be a string", required_error: "Content is requiered" })
		.trim()
		.min(1, "Content must be at least 1 character long"),
	chatId: z.number({
		invalid_type_error: "ChatId is requiered and must be a number",
		required_error: "ChatId is requiered",
	}),
	userId: z.number(),
});

export type CreateMessageParams = z.infer<typeof CreateMessageParamsSchema>;

export const DeleteMessageParamsSchema = z.object({
	messageId: z.number({ invalid_type_error: "MessageId is requiered and must be a number" }),
	userId: z.number(),
});

export type DeleteMessageParams = z.infer<typeof DeleteMessageParamsSchema>;

export const EditMessageParamsSchema = z.object({
	messageId: z.number({ invalid_type_error: "MessageId is requiered and must be a number" }),
	content: z
		.string({ invalid_type_error: "Content must be a string", required_error: "Content is requiered" })
		.trim()
		.min(1, "Content must be at least 1 character long"),
	userId: z.number(),
});

export type EditMessageParams = z.infer<typeof EditMessageParamsSchema>;

interface MessageService {
	getMessageList(params: GetMessageListParams): Promise<MessageModel[]>;
	createMessage(params: CreateMessageParams): Promise<MessageModel>;
	deleteMessage(params: DeleteMessageParams): Promise<MessageModel>;
	editMessage(params: EditMessageParams): Promise<MessageModel>;
}

export default MessageService;
