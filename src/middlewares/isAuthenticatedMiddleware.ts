import { Request, Response, NextFunction } from "express";
import createError from "http-errors";

const isAuthenticatedMiddleware = (req: Request, res: Response, next: NextFunction) => {
	if (!req.userId) {
		return res
			.status(req.authError?.statusCode || 500)
			.json({ error: req.authError?.message || "Internal server error" });
	}
	next();
};

export default isAuthenticatedMiddleware;
