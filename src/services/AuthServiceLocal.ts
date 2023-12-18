import bcrypt from "bcrypt";
import createError from "http-errors";
import jwt from "jsonwebtoken";
import { AuthService, UserService } from "./interfaces";
import { AuthToken, SignInParams, SignUpParams } from "./interfaces/AuthService";
import { UserModel } from "../models";
class AuthServiceJWT implements AuthService {
	private userService: UserService;
	constructor(injectedUserService: UserService) {
		this.userService = injectedUserService;
	}
	public async signUp(params: SignUpParams<"local">) {
		const { username, email, password } = params;
		try {
			let existingUser = await this.userService.getUserByEmail({ email });
			if (existingUser) {
				throw createError(400, "User with given email already exists");
			}
			existingUser = await this.userService.getUserByUsername({ username });
			if (existingUser) {
				throw createError(400, "User with given username already exists");
			}
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
			const newUser = await this.userService.createUserWithLocal({ username, email, hashedPassword });
			return newUser;
		} catch (error: any) {
			throw createError(error.statusCode || 500, error.message || "Internal server error");
		}
	}
	public async signIn(params: SignInParams<"local">): Promise<AuthToken & UserModel> {
		const { usernameOrEmail, password } = params;
		try {
			const existingUser = await this.userService.getUserByEmailOrUsername({ usernameOrEmail });
			if (!existingUser) {
				throw createError(401, "Invalid email or username");
			}
			if (!existingUser.passwordHash) {
				throw createError(400, "User doesn't have a password");
			}
			const isPasswordCorrect = await bcrypt.compare(password, existingUser.passwordHash!);
			if (!isPasswordCorrect) {
				throw createError(401, "Invalid password");
			}
			const token = jwt.sign({ userId: existingUser.id }, process.env.JWT_SECRET!, { expiresIn: "6h" });
			return { token, expires: Date.now() + 6 * 60 * 60 * 1000, ...existingUser };
		} catch (error: any) {
			throw createError(error.statusCode || 500, error.message || "Internal server error");
		}
	}
}
export default AuthServiceJWT;
