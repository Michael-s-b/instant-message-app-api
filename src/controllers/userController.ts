import { Request, Response } from "express";
import { User } from "../models";

const userController = {
	getAllUsers: async (req: Request, res: Response) => {
		const allUsers = await User.findMany();

		res.json({ data: allUsers }).status(200);
	},
	createUser: async (req: Request, res: Response) => {
		const { username, email, password } = req.body;
		try {
			let existingUser = await User.findUnique({ where: { email } });
			if (existingUser) {
				res.json({ error: "User with given email already exists" }).status(400);
				return;
			}
			existingUser = await User.findUnique({ where: { username } });
			if (existingUser) {
				res.json({ error: "User with given username already exists" }).status(400);
				return;
			}

			const newUser = await User.create({ data: { username, email, passwordHash: password } });
			res.json({ data: newUser }).status(201);
		} catch (error) {
			res.json({ error }).status(500);
		}
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
