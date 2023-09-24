import { Request, Response, NextFunction } from "express";
import { AuthServiceGoogle, AuthServiceLocal, UserServicePrisma } from "../services";
import { AuthService, UserService } from "../services/interfaces";
import { createRedisClient } from "../database";
import { HTTP_STATUS_CODE } from "../enums";
import {
	AuthToken,
	SignInParamsGoogleSchema,
	SignInParamsLocalSchema,
	SignUpParamsGoogleSchema,
	SignUpParamsLocalSchema,
} from "../services/interfaces/AuthService";
import createError from "http-errors";
import { fromZodError } from "zod-validation-error";
class AuthController {
	//POST api/auth/signup
	public async signUp(req: Request, res: Response, next: NextFunction) {
		const { username, email, password } = req.body;
		const provider = req.query.provider as string;
		const googleCode = req.query.code as string;
		const redirectUri = req.query.redirectUri as string;
		let authService: AuthService;
		let userService: UserService;
		let newUser;
		try {
			userService = new UserServicePrisma();
			if (provider === "google") {
				const parsedParams = SignUpParamsGoogleSchema.safeParse({ googleCode, redirectUri });
				if (!parsedParams.success)
					throw createError(HTTP_STATUS_CODE.BAD_REQUEST, fromZodError(parsedParams.error).message);
				authService = new AuthServiceGoogle(userService);
				newUser = await (authService as AuthServiceGoogle).signUp(parsedParams.data);
			} else {
				const parsedParams = SignUpParamsLocalSchema.safeParse({ username, email, password });
				if (!parsedParams.success)
					throw createError(HTTP_STATUS_CODE.BAD_REQUEST, fromZodError(parsedParams.error).message);
				authService = new AuthServiceLocal(userService);
				newUser = await (authService as AuthServiceLocal).signUp({ username, email, password });
			}
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
			let token: AuthToken;
			if (provider === "google") {
				const parsedParams = SignInParamsGoogleSchema.safeParse({ googleCode, redirectUri });
				if (!parsedParams.success)
					throw createError(HTTP_STATUS_CODE.BAD_REQUEST, fromZodError(parsedParams.error).message);
				authService = new AuthServiceGoogle(userService);
				token = await (authService as AuthServiceGoogle).signIn(parsedParams.data);
			} else {
				const parsedParams = SignInParamsLocalSchema.safeParse({ emailOrUsername, password });
				if (!parsedParams.success)
					throw createError(HTTP_STATUS_CODE.BAD_REQUEST, fromZodError(parsedParams.error).message);
				authService = new AuthServiceLocal(userService);
				token = await authService.signIn(parsedParams.data);
			}
			return res
				.status(HTTP_STATUS_CODE.OK)
				.cookie("AuthToken", token.token, {
					httpOnly: false,
					//secure: true,
					sameSite: "none",
					expires: new Date(token.expires),
				})
				.json({ ...token });
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
