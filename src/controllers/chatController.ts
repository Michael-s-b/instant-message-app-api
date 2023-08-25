import { Request, Response } from "express";

const chatController = {
	getAllChats: async (req: Request, res: Response) => {
		res.send("GET /chats");
	},
	createChat: async (req: Request, res: Response) => {
		res.send("POST /chats");
	},
	getChatById: async (req: Request, res: Response) => {
		res.send("GET /chats/:id");
	},
	updateChat: async (req: Request, res: Response) => {
		res.send("PUT /chats/:id");
	},
	deleteChat: async (req: Request, res: Response) => {
		res.send("DELETE /chats/:id");
	},
};
export default chatController;
