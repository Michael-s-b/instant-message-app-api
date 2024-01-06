import { NextFunction, Request, Response } from "express";
const exceptionHandlerMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
	console.log(err.message);
	if (req.authError) {
		res.clearCookie("AuthToken");
	}
	res.status(err.statusCode || 500).json({ error: err.message });
};
export default exceptionHandlerMiddleware;
