import { UserModel } from "../models";
import { AuthService, UserService } from "./interfaces";
import axios from "axios";
import createError from "http-errors";
import jwt from "jsonwebtoken";
const clientId = "765654930274-8dmqbor7pkkmr6sbuk8k8un634b5upqg.apps.googleusercontent.com";
const clientSecret = "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";
const redirectUri = "http://localhost:3000/api/auth/signup";
const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=profile email`;

class AuthServiceGoogle implements AuthService {
	userService: UserService;
	constructor(injectedUserService: UserService) {
		this.userService = injectedUserService;
	}
	async signIn(params: { googleCode: string }): Promise<string> {
		const { googleCode } = params;
		let tokenResponse;
		try {
			try {
				tokenResponse = await axios.post("https://oauth2.googleapis.com/token", null, {
					params: {
						code: googleCode,
						client_id: clientId,
						client_secret: clientSecret,
						redirect_uri: redirectUri,
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
			const existingUser = await this.userService.getUserByEmailOrUsername(userData.email);
			if (!existingUser) {
				throw createError(401, "Invalid email or username");
			}
			const token = jwt.sign({ userId: existingUser.id }, process.env.JWT_SECRET!, { expiresIn: "6h" });
			return token;
		} catch (error: any) {
			throw createError(error.statusCode || 500, error.message || "Internal server error");
		}
	}
	async signUp(params: { googleCode: string }): Promise<UserModel> {
		const { googleCode } = params;
		let tokenResponse;
		try {
			try {
				tokenResponse = await axios.post("https://oauth2.googleapis.com/token", null, {
					params: {
						code: googleCode,
						client_id: clientId,
						client_secret: clientSecret,
						redirect_uri: redirectUri,
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
			const newUser = await this.userService.createUser(userData.name, userData.email, "google");
			return newUser;
		} catch (error: any) {
			throw createError(error.statusCode || 500, error.message || "Internal server error");
		}
	}
}

export default AuthServiceGoogle;
