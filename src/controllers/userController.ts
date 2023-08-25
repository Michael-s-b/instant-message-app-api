import { Request, Response } from "express";
import { User } from "../models";

const userController = {
	getAllUsers: async (req: Request, res: Response) => {
		const allUsers = await User.findMany();

		res.json({ data: allUsers }).status(200);
	},
	getUserById: (req: Request, res: Response) => {
		res.send("GET /users/:id");
	},
	updateUser: (req: Request, res: Response) => {
		res.send("PUT /users/:id");
	},
	deleteUser: (req: Request, res: Response) => {
		res.send("DELETE /users/:id");
	},
};
export default userController;
