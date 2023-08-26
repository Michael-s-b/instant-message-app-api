import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import jwt from "jsonwebtoken";
import { User } from "../models";
const authTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	let decodedToken: { userId: string };
	try {
		const authorizationHeader = req.headers["authorization"];
		if (!authorizationHeader) {
			req.userId = null;
			req.authError = createError(401, "No Authorization header was provided");
			return next();
		}
		const token = authorizationHeader.split(" ")[1];
		if (!token) {
			req.userId = null;
			req.authError = createError(401, "No token was provided");
			return next();
		}
		try {
			decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
		} catch (error) {
			req.userId = null;
			req.authError = createError(401, "Invalid token");
			return next();
		}
		try {
			const foundUser = await User.findUnique({ where: { id: Number.parseInt(decodedToken.userId) } });
			if (!foundUser) {
				req.userId = null;
				req.authError = createError(404, "User with given token does not exist");
				return next();
			}
			req.userId = foundUser.id;
			req.authError = null;
			return next();
		} catch (error: any) {
			req.userId = null;
			req.authError = createError(500, "Unknown error occured while trying to find user with given id");
			return next();
		}
	} catch (error: any) {
		req.userId = null;
		req.authError = createError(500, error.message);
		return next();
	}
};
export default authTokenMiddleware;
