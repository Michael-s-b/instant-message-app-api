import { Request, Response, NextFunction } from "express";
import createError from "http-errors";

const isAuthenticatedMiddleware = (req: Request, res: Response, next: NextFunction) => {
	if (!req.userId) {
		return res.json({ error: req.authError?.message }).status(401);
	}
	next();
};

export default isAuthenticatedMiddleware;
