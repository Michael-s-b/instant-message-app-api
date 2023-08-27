import bcrypt from "bcrypt";
import { User } from "../models";
import createError from "http-errors";
import jwt from "jsonwebtoken";
const authService = {
	async signUp(username: any, email: any, password: any) {
		if (!username || !email || !password) {
			throw createError(400, "Please fill all fields");
		}
		try {
			let existingUser = await User.findUnique({ where: { email } });
			if (existingUser) {
				throw createError(400, "User with given email already exists");
			}
			existingUser = await User.findUnique({ where: { username } });
			if (existingUser) {
				throw createError(400, "User with given username already exists");
			}
			const salt = await bcrypt.genSalt(10);
			const hashedPassowrd = await bcrypt.hash(password, salt);

			const newUser = await User.create({ data: { username, email, passwordHash: hashedPassowrd } });
			return newUser;
		} catch (error: any) {
			throw error;
		}
	},
	async signIn(username: any, password: any) {
		if (!username || !password) {
			throw createError(400, "Please fill all fields");
		}
		try {
			const existingUser = await User.findFirst({
				where: {
					OR: [
						{
							email: username,
						},
						{
							username: username,
						},
					],
				},
			});
			if (!existingUser) {
				throw createError(401, "Invalid email or username");
			}
			const isPasswordCorrect = await bcrypt.compare(password, existingUser.passwordHash);
			if (!isPasswordCorrect) {
				throw createError(401, "Invalid password");
			}
			const token = jwt.sign({ userId: existingUser.id }, process.env.JWT_SECRET!, { expiresIn: "6h" });
			return token;
		} catch (error: any) {
			throw error;
		}
	},
	async logOut() {
		//TODO: implement logout
		throw new Error("Not implemented");
	},
};
export default authService;
