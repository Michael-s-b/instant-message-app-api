import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models";
const authController = {
	signUp: async (req: Request, res: Response) => {
		const { username, email, password } = req.body;
		//validate username, email, password
		if (!username || !email || !password) {
			return res.json({ error: "Please fill all fields" }).status(400);
		}
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
			const salt = await bcrypt.genSalt(10);
			const hashedPassowrd = await bcrypt.hash(password, salt);

			const newUser = await User.create({ data: { username, email, passwordHash: hashedPassowrd } });
			res.json({ data: newUser }).status(201);
		} catch (error: any) {
			res.json({ error: error.message }).status(500);
		}
	},
	signIn: async (req: Request, res: Response) => {},
	logOut: async (req: Request, res: Response) => {},
};
export default authController;
