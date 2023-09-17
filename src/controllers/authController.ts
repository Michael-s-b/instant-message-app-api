import { Request, Response } from "express";
import { AuthServiceGoogle, AuthServiceLocal, UserServicePrisma } from "../services";
import { AuthService, UserService } from "../services/interfaces";
import { createRedisClient } from "../database";
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
	//GET api/auth/logout
	public async logOut(req: Request, res: Response) {
		try {
			const authorizationHeader = req.headers["authorization"];
			const token = authorizationHeader!.split(" ")[1];
			console.log("token: " + token);
			const redisClient = createRedisClient();
			await redisClient.connect();
			console.log(await redisClient.setEx(token, 60 * 60 * 24, "blacklisted"));
			await redisClient.disconnect();
			res.status(200).json({ message: "Successfully logged out" });
		} catch (error: any) {
			return res.status(error.statusCode || 500).json({ error: error.message });
		}
	}
}
export default AuthController;
