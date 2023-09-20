import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import { HTTP_STATUS_CODE } from "../enums";

const isAuthenticatedMiddleware = (req: Request, res: Response, next: NextFunction) => {
	if (!req.userId) {
		next(
			createError(
				req?.authError?.statusCode || HTTP_STATUS_CODE.FORBIDDEN,
				req?.authError?.message || "Forbidden"
			)
		);
		// return res
		// 	.status(req.authError?.statusCode || 500)
		// 	.json({ error: req.authError?.message || "Internal server error" });
	}
	next();
};

export default isAuthenticatedMiddleware;
