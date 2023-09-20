import { UserModel } from "../models";
import { AuthService, UserService } from "./interfaces";
import axios from "axios";
import createError from "http-errors";
import jwt from "jsonwebtoken";
import { AuthToken, SignInParams, SignUpParams } from "./interfaces/AuthService";
import { OAuth2Client } from "google-auth-library";
import { z } from "zod";
import { HTTP_STATUS_CODE } from "../enums";
const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
//const redirectUri = "http://localhost:3000/api/auth/signup";
//const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=profile email`;

class AuthServiceGoogle implements AuthService {
	userService: UserService;
	constructor(injectedUserService: UserService) {
		this.userService = injectedUserService;
	}
	async signIn(params: SignInParams<"google">): Promise<AuthToken> {
		const { googleCode, redirectUri } = params;
		try {
			// try {
			// 	tokenResponse = await axios.post("https://oauth2.googleapis.com/token", null, {
			// 		params: {
			// 			code: googleCode,
			// 			client_id: clientId,
			// 			client_secret: clientSecret,
			// 			redirect_uri: "http://localhost:3000/api/auth/signin?provider=google",
			// 			grant_type: "authorization_code",
			// 		},
			// 	});
			// } catch (error: any) {
			// 	throw createError(400, "Invalid google code");
			// }
			// const { access_token } = tokenResponse.data;
			// const profileResponse = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
			// 	headers: {
			// 		Authorization: `Bearer ${access_token}`,
			// 	},
			// });
			// const userData = profileResponse.data;
			if (!redirectUri || !googleCode)
				throw createError(HTTP_STATUS_CODE.BAD_REQUEST, "Missing required query parameters values");
			const oAuth2Client = new OAuth2Client(clientId, clientSecret, redirectUri);
			console.log(redirectUri);

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

			const existingUser = await this.userService.getUserByEmailOrUsername(userInfo.email);
			if (!existingUser) {
				throw createError(HTTP_STATUS_CODE.NOT_FOUND, "User with given email or username does not exist");
			}
			const token = jwt.sign({ userId: existingUser.id }, process.env.JWT_SECRET!, { expiresIn: "6h" });
			return { token, expires: Date.now() + 6 * 60 * 60 * 1000 };
		} catch (error: any) {
			throw createError(
				error.statusCode || HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				error.message || "Internal server error"
			);
		}
	}
	async signUp(params: SignUpParams<"google">): Promise<UserModel> {
		const { googleCode } = params;
		let tokenResponse;
		try {
			try {
				tokenResponse = await axios.post("https://oauth2.googleapis.com/token", null, {
					params: {
						code: googleCode,
						client_id: clientId,
						client_secret: clientSecret,
						redirect_uri: "http://localhost:3000/api/auth/signup?provider=google",
						grant_type: "authorization_code",
					},
				});
			} catch (error: any) {
				throw createError(400, "Invalid google code");
			}
			const { access_token } = tokenResponse.data;
			const profileResponse = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
				headers: {
					Authorization: `Bearer ${access_token}`,
				},
			});
			const userData = profileResponse.data;
			let existingUser = await this.userService.getUserByEmail(userData.email);
			if (existingUser) {
				throw createError(400, "User with given email already exists");
			}
			existingUser = await this.userService.getUserByUsername(userData.name);
			if (existingUser) {
				throw createError(400, "User with given username already exists");
			}
			const newUser = await this.userService.createUserWithGoogle({
				username: userData.name,
				email: userData.email,
				googleId: userData.id,
			});
			return newUser;
		} catch (error: any) {
			throw createError(error.statusCode || 500, error.message || "Internal server error");
		}
	}
}

export default AuthServiceGoogle;
