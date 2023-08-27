import { Request, Response } from "express";
import { authService } from "../services";
const authController = {
	signUp: async (req: Request, res: Response) => {
		const { username, email, password } = req.body;
		try {
			const newUser = await authService.signUp(username, email, password);
			return res.status(201).json(newUser);
		} catch (error: any) {
			return res.status(error.statusCode || 500).json({ error: error.message });
		}
	},
	signIn: async (req: Request, res: Response) => {
		const { username, password } = req.body;
		//validate email, password
		try {
			const token = await authService.signIn(username, password);
			return res.status(200).json(token);
		} catch (error: any) {
			return res.status(error.statusCode || 500).json({ error: error.message });
		}
	},
	logOut: async (req: Request, res: Response) => {},
};
export default authController;
