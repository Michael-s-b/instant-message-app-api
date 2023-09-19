import { Request, Response, NextFunction } from "express";
import { AuthServiceGoogle, AuthServiceLocal, UserServicePrisma } from "../services";
import { AuthService, UserService } from "../services/interfaces";
import { createRedisClient } from "../database";
import { HTTP_STATUS_CODE } from "../enums";
class AuthController {
	//POST api/auth/signup
	public async signUp(req: Request, res: Response, next: NextFunction) {
		const { username, email, password } = req.body;
		const provider = req.query.provider as string;
		const googleCode = req.query.code as string;
		const redirectUri = req.query.redirectUri as string;
		let authService: AuthService;
		let userService: UserService;

		try {
			userService = new UserServicePrisma();
			if (provider === "google") {
				authService = new AuthServiceGoogle(userService);
				const newUser = await (authService as AuthServiceGoogle).signUp({ googleCode, redirectUri });
				return res.status(HTTP_STATUS_CODE.CREATED).json(newUser);
			}
			authService = new AuthServiceLocal(userService);
			const newUser = await (authService as AuthServiceLocal).signUp({ username, email, password });
			return res.status(HTTP_STATUS_CODE.CREATED).json(newUser);
		} catch (error: any) {
			next(error);
		}
	}
	//POST api/auth/signin
	public async signIn(req: Request, res: Response, next: NextFunction) {
		const { emailOrUsername, password } = req.body;
		const provider = req.query.provider as string;
		const googleCode = req.query.code as string;
		const redirectUri = req.query.redirectUri as string;
		let authService: AuthService;
		let userService: UserService;
		try {
			userService = new UserServicePrisma();
			if (provider === "google") {
				authService = new AuthServiceGoogle(userService);
				const token = await (authService as AuthServiceGoogle).signIn({ googleCode, redirectUri });
				return res.status(HTTP_STATUS_CODE.OK).json(token);
			}
			authService = new AuthServiceLocal(userService);
			const token = await authService.signIn({ emailOrUsername, password });
			return res.status(HTTP_STATUS_CODE.OK).json(token);
		} catch (error: any) {
			next(error);
		}
	}
	//GET api/auth/logout
	public async logOut(req: Request, res: Response, next: NextFunction) {
		try {
			const authorizationHeader = req.headers["authorization"];
			const token = authorizationHeader!.split(" ")[1];
			console.log("token: " + token);
			const redisClient = createRedisClient();
			await redisClient.connect();
			console.log(await redisClient.setEx(token, 60 * 60 * 24, "blacklisted"));
			await redisClient.disconnect();
			res.status(HTTP_STATUS_CODE.OK).json({ message: "Successfully logged out" });
		} catch (error: any) {
			next(error);
		}
	}
}
export default AuthController;
