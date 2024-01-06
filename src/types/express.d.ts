import { HttpError } from "http-errors";
import { User } from "../models";
declare global {
	namespace Express {
		interface Request {
			userId: number | null;
			authError: HttpError | null;
			token: string | null;
		}
	}
}
