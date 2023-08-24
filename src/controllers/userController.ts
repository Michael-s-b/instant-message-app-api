import { Request, Response } from "express";

const userController = {
	getAllUsers: async (req: Request, res: Response) => {
		res.send("GET /users");
	},
	createUser: async (req: Request, res: Response) => {
		res.send("POST /users");
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
