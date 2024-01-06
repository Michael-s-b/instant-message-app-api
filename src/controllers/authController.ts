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
import { UserModel } from "../models";

type SuccessResponse<TData> = {
	status: "success";
	message: string;
	data?: TData;
};

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
			if (!newUser) throw createError(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR, "Failed to create user");
			const responseBody: SuccessResponse<null> = {
				status: "success",
				message: "Successfully signed up",
				data: null,
			};
			res.status(HTTP_STATUS_CODE.CREATED).json(responseBody);
		} catch (error: any) {
			next(error);
		}
	}
	//POST api/auth/signin
	public async signIn(req: Request, res: Response, next: NextFunction) {
		const { usernameOrEmail, password } = req.body;
		const provider = req.query.provider as string;
		const googleCode = req.query.code as string;
		const redirectUri = req.query.redirectUri as string;
		let authService: AuthService;
		let userService: UserService;
		try {
			userService = new UserServicePrisma();
			let userAuth: AuthToken & UserModel;
			if (provider === "google") {
				const parsedParams = SignInParamsGoogleSchema.safeParse({ googleCode, redirectUri });
				if (!parsedParams.success)
					throw createError(HTTP_STATUS_CODE.BAD_REQUEST, fromZodError(parsedParams.error).message);
				authService = new AuthServiceGoogle(userService);
				userAuth = await (authService as AuthServiceGoogle).signIn(parsedParams.data);
			} else {
				const parsedParams = SignInParamsLocalSchema.safeParse({ usernameOrEmail, password });
				if (!parsedParams.success)
					throw createError(HTTP_STATUS_CODE.BAD_REQUEST, fromZodError(parsedParams.error).message);
				authService = new AuthServiceLocal(userService);
				userAuth = await authService.signIn(parsedParams.data);
			}
			const responseBody: SuccessResponse<{
				id: number;
				username: string;
				email: string;
			}> = {
				status: "success",
				message: "Successfully signed in",
				data: { id: userAuth.id, username: userAuth.username, email: userAuth.email },
			};

			res.status(HTTP_STATUS_CODE.OK)
				.cookie("AuthToken", userAuth.token, {
					httpOnly: true,
					//secure: true,
					//sameSite: "none",
					expires: new Date(userAuth.expires),
				})
				.json(responseBody);
		} catch (error: any) {
			next(error);
		}
	}
	//GET api/auth/logout
	public async logOut(req: Request, res: Response, next: NextFunction) {
		try {
			const token = req.token!;
			console.log("Blacklisted token: ", token);
			const redisClient = createRedisClient();
			await redisClient.connect();
			console.log(await redisClient.setEx(token, 60 * 60 * 24, "blacklisted"));
			await redisClient.disconnect();
			res.clearCookie("AuthToken");
			res.status(HTTP_STATUS_CODE.OK);
			const responseBody: SuccessResponse<null> = {
				status: "success",
				message: "Successfully logged out",
				data: null,
			};
			res.json(responseBody);
			return res;
		} catch (error: any) {
			next(error);
		}
	}
}
export default AuthController;
