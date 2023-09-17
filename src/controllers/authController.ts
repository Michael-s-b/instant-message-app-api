import { Request, Response } from "express";
import { AuthServiceGoogle, AuthServiceLocal, UserServicePrisma } from "../services";
import { AuthService, UserService } from "../services/interfaces";

class AuthController {
	//POST api/auth/signup
	public async signUp(req: Request, res: Response) {
		const { username, email, password } = req.body;
		const provider = req.query.provider as string;
		const googleCode = req.query.code as string;
		let authService: AuthService;
		let userService: UserService;

		try {
			userService = new UserServicePrisma();
			if (provider === "google") {
				authService = new AuthServiceGoogle(userService);
				const newUser = await (authService as AuthServiceGoogle).signUp({ googleCode });
				return res.status(201).json(newUser);
			}
			authService = new AuthServiceLocal(userService);
			const newUser = await (authService as AuthServiceLocal).signUp({ username, email, password });
			return res.status(201).json(newUser);
		} catch (error: any) {
			return res.status(error.statusCode || 500).json({ error: error.message });
		}
	}
	//POST api/auth/signin
	public async signIn(req: Request, res: Response) {
		const { emailOrUsername, password } = req.body;
		const provider = req.query.provider as string;
		const googleCode = req.query.code as string;
		let authService: AuthService;
		let userService: UserService;
		try {
			userService = new UserServicePrisma();
			if (provider === "google") {
				authService = new AuthServiceGoogle(userService);
				const token = await (authService as AuthServiceGoogle).signIn({ googleCode });
				return res.status(200).json(token);
			}
			authService = new AuthServiceLocal(userService);
			const token = await authService.signIn({ emailOrUsername, password });
			return res.status(200).json(token);
		} catch (error: any) {
			return res.status(error.statusCode || 500).json({ error: error.message });
		}
	}
	//public logOut (req: Request, res: Response) {},
}
export default AuthController;
