import bcrypt from "bcrypt";
import createError from "http-errors";
import jwt from "jsonwebtoken";
import { AuthService, UserService } from "./interfaces";
import { SignInParams, SignUpParams } from "./interfaces/AuthService";

//auth service should not be responsible for creating users or getting users
//it should work independently of the database implementation or ORM's
// it should only be responsible for authenticating users
// it should take a UserService as a parameter
// dependency injection
class AuthServiceJWT implements AuthService {
	private userService: UserService; // change to a UserService interface
	constructor(injectedUserService: UserService) {
		//should take a UserService as a parameter
		// dependency injection
		this.userService = injectedUserService;
	}
	public async signUp(params: SignUpParams<"jwt">) {
		const { username, email, password } = params;
		if (!username || !email || !password) {
			throw createError(400, "Please fill all fields");
		}
		try {
			// let existingUser = await this.User.findUnique({ where: { email } });
			let existingUser = await this.userService.getUserByEmail(email);
			if (existingUser) {
				throw createError(400, "User with given email already exists");
			}
			//existingUser = await this.User.findUnique({ where: { username } });
			existingUser = await this.userService.getUserByUsername(username);
			if (existingUser) {
				throw createError(400, "User with given username already exists");
			}
			const salt = await bcrypt.genSalt(10);
			const hashedPassowrd = await bcrypt.hash(password, salt);

			//const newUser = await this.User.create({ data: { username, email, passwordHash: hashedPassowrd } });
			const newUser = await this.userService.createUser(username, email, hashedPassowrd);
			return newUser;
		} catch (error: any) {
			throw createError(error.statusCode || 500, error.message || "Internal server error");
		}
	}
	public async signIn(params: SignInParams<"jwt">) {
		const { emailOrUsername, password } = params;
		if (!emailOrUsername || !password) {
			throw createError(400, "Please fill all fields");
		}
		try {
			const existingUser = await this.userService.getUserByEmailOrUsername(emailOrUsername);
			if (!existingUser) {
				throw createError(401, "Invalid email or username");
			}
			//for now a user always has a hashedPassword so no need to check for null
			// but in the future we might have a user that doesn't have a password for example using google auth
			const isPasswordCorrect = await bcrypt.compare(password, existingUser.passwordHash);
			if (!isPasswordCorrect) {
				throw createError(401, "Invalid password");
			}
			const token = jwt.sign({ userId: existingUser.id }, process.env.JWT_SECRET!, { expiresIn: "6h" });
			return token;
		} catch (error: any) {
			throw createError(error.statusCode || 500, error.message || "Internal server error");
		}
	}
}
export default AuthServiceJWT;
