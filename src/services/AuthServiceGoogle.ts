import { UserModel } from "../models";
import { AuthService, UserService } from "./interfaces";
import createError from "http-errors";
import jwt from "jsonwebtoken";
import { AuthToken, SignInParams, SignUpParams } from "./interfaces/AuthService";
import { OAuth2Client } from "google-auth-library";
import { z } from "zod";
import { HTTP_STATUS_CODE } from "../enums";

class AuthServiceGoogle implements AuthService {
	userService: UserService;
	constructor(injectedUserService: UserService) {
		this.userService = injectedUserService;
	}
	async signIn(params: SignInParams<"google">): Promise<AuthToken & UserModel> {
		const { googleCode, redirectUri } = params;
		try {
			const oAuth2Client = new OAuth2Client(
				process.env.GOOGLE_CLIENT_ID,
				process.env.GOOGLE_CLIENT_SECRET,
				redirectUri
			);
			let tokens;

			try {
				const data = await oAuth2Client.getToken(googleCode);
				tokens = data.tokens;
			} catch (error) {
				throw createError(HTTP_STATUS_CODE.BAD_REQUEST, "Invalid google code");
			}

			oAuth2Client.setCredentials(tokens);
			const { data } = await oAuth2Client.request({ url: "https://www.googleapis.com/oauth2/v2/userinfo" });
			const UserInfo = z.object({
				email: z.string(),
				name: z.string(),
				id: z.string(),
				verified_email: z.boolean(),
				given_name: z.string(),
				family_name: z.string(),
				picture: z.string(),
				locale: z.string(),
			});
			let userInfo;

			try {
				userInfo = UserInfo.parse(data);
			} catch (error: any) {
				throw createError(HTTP_STATUS_CODE.BAD_REQUEST, "Parsing UserInfo failed");
			}

			const existingUser = await this.userService.getUserByEmailOrUsername({ usernameOrEmail: userInfo.email });

			if (!existingUser) {
				throw createError(HTTP_STATUS_CODE.NOT_FOUND, "User with given email or username does not exist");
			}

			const token = jwt.sign({ userId: existingUser.id }, process.env.JWT_SECRET!, { expiresIn: "6h" });
			return { token, expires: Date.now() + 6 * 60 * 60 * 1000, ...existingUser };
		} catch (error: any) {
			throw createError(
				error.statusCode || HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				error.message || "Internal server error"
			);
		}
	}
	async signUp(params: SignUpParams<"google">): Promise<UserModel> {
		const { googleCode, redirectUri } = params;
		let tokens;
		try {
			const oAuth2Client = new OAuth2Client(
				process.env.GOOGLE_CLIENT_ID,
				process.env.GOOGLE_CLIENT_SECRET,
				redirectUri
			);
			//get access token
			try {
				const data = await oAuth2Client.getToken(googleCode);
				tokens = data.tokens;
			} catch (error: any) {
				throw createError(400, "Invalid google code");
			}
			oAuth2Client.setCredentials(tokens);
			// use access token to get user info
			const { data } = await oAuth2Client.request({ url: "https://www.googleapis.com/oauth2/v2/userinfo" });

			const UserInfo = z.object({
				email: z.string(),
				name: z.string(),
				id: z.string(),
				verified_email: z.boolean(),
				given_name: z.string(),
				family_name: z.string(),
				picture: z.string(),
				locale: z.string(),
			});
			let userInfo;
			try {
				userInfo = UserInfo.parse(data);
			} catch (error: any) {
				throw createError(HTTP_STATUS_CODE.BAD_REQUEST, "Parsing UserInfo failed");
			}
			let existingUser = await this.userService.getUserByEmail({ email: userInfo.email });
			if (existingUser) {
				throw createError(400, "User with given email already exists");
			}
			existingUser = await this.userService.getUserByUsername({ username: userInfo.name });
			if (existingUser) {
				throw createError(400, "User with given username already exists");
			}
			const newUser = await this.userService.createUserWithGoogle({
				username: userInfo.name,
				email: userInfo.email,
				googleId: userInfo.id,
			});
			return newUser;
		} catch (error: any) {
			throw createError(error.statusCode || 500, error.message || "Internal server error");
		}
	}
}

export default AuthServiceGoogle;
