import { Request, Response } from "express";
import { AuthServiceJWT, UserServicePrisma } from "../services";
import { AuthService, UserService } from "../services/interfaces";

class AuthController {
	public async signUp(req: Request, res: Response) {
		const { username, email, password } = req.body;
		let authService: AuthService;
		let userService: UserService;
		try {
			userService = new UserServicePrisma();
			authService = new AuthServiceJWT(userService);
			const newUser = await authService.signUp(username, email, password);
			return res.status(201).json(newUser);
		} catch (error: any) {
			return res.status(error.statusCode || 500).json({ error: error.message });
		}
	}
	public async signIn(req: Request, res: Response) {
		const { username, password } = req.body;
		let authService: AuthService;
		let userService: UserService;
		try {
			userService = new UserServicePrisma();
			authService = new AuthServiceJWT(userService);
			const token = await authService.signIn(username, password);
			return res.status(200).json(token);
		} catch (error: any) {
			return res.status(error.statusCode || 500).json({ error: error.message });
		}
	}
	//public logOut (req: Request, res: Response) {},
}
export default AuthController;
