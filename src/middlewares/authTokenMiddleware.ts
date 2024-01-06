import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import jwt from "jsonwebtoken";
import { UserServicePrisma } from "../services";
import { createRedisClient } from "../database";
import { HTTP_STATUS_CODE } from "../enums";
const authTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	const redisClient = createRedisClient();
	let decodedToken: { userId: string } | null = null;
	const userService = new UserServicePrisma();
	//try to extract the token from the request
	try {
		const AuthToken = req.cookies.AuthToken;
		if (!AuthToken) {
			req.userId = null;
			req.authError = createError(HTTP_STATUS_CODE.BAD_REQUEST, "No AuthToken cookie was found in the request");
			return next();
		}
		//verify the token
		try {
			decodedToken = jwt.verify(AuthToken, process.env.JWT_SECRET!) as { userId: string };
		} catch (error: any) {
			req.userId = null;
			req.authError = createError(HTTP_STATUS_CODE.BAD_REQUEST, "Invalid Token");
			return next();
		}
		//check if token is blacklisted
		try {
			await redisClient.connect();
			redisClient.on("error", (error) => {
				console.log("Error occured while trying to connect to redis");
				throw error;
			});
			if (await redisClient.exists(AuthToken)) {
				req.userId = null;
				req.authError = createError(HTTP_STATUS_CODE.FORBIDDEN, "Token is blacklisted");
				return next();
			}
		} catch (error: any) {
			req.userId = null;
			req.authError = createError(
				HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				error.message ||
					"Unknown error occured while trying to connect to redis and check if token is blacklisted"
			);
			return next();
		} finally {
			if (redisClient) await redisClient.disconnect();
		}
		//find the user with the id from the token and attach it to the request
		try {
			//const foundUser = await User.findUnique({ where: { id: Number.parseInt(decodedToken.userId) } });
			const foundUser = await userService.getUserById({ id: Number.parseInt(decodedToken.userId) });
			if (!foundUser) {
				req.userId = null;
				req.authError = createError(HTTP_STATUS_CODE.NOT_FOUND, "User with given token does not exist");
				return next();
			}
			req.token = AuthToken;
			req.userId = foundUser.id;
			req.authError = null;
			return next();
		} catch (error: any) {
			req.userId = null;
			req.authError = createError(
				HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				error.message || "Unknown error occured while trying to find user with given id"
			);
			return next();
		}
	} catch (error: any) {
		req.userId = null;
		req.authError = createError(
			HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
			error.message || "Unknown error occured while trying to verify token"
		);
		return next();
	}
};
export default authTokenMiddleware;
