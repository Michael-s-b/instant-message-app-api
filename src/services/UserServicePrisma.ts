import { UserService } from "./interfaces";
import { UserModel } from "../models";
import createError from "http-errors";
import { prismaClient } from "../database";

class UserServicePrisma implements UserService {
	private User;
	constructor() {
		// dependency injection
		this.User = prismaClient.user;
	}
	async getAllUsers(): Promise<UserModel[]> {
		try {
			return await this.User.findMany();
		} catch (error: any) {
			throw createError(error.statusCode || 500, error.message || "Internal server error");
		}
	}
	async createUser(username: any, email: any, hashedPassowrd?: any): Promise<UserModel> {
		try {
			if (!username || !email || !hashedPassowrd) throw createError(400, "Missing required fields");
			return await this.User.create({
				data: { username, email, passwordHash: hashedPassowrd, Profile: { create: {} } },
				include: { Profile: true },
			});
		} catch (error: any) {
			throw createError(error.statusCode || 500, error.message || "Internal server error");
		}
	}
	async getUserById(id: any): Promise<UserModel | null> {
		try {
			if (!id) throw createError(400, "Missing required fields");
			return await this.User.findUnique({ where: { id: Number.parseInt(id) } });
		} catch (error: any) {
			throw createError(error.statusCode || 500, error.message || "Internal server error");
		}
	}
	async getUserByEmail(email: any): Promise<UserModel | null> {
		try {
			if (!email) throw createError(400, "Missing required fields");
			return await this.User.findUnique({ where: { email: email } });
		} catch (error: any) {
			throw createError(error.statusCode || 500, error.message || "Internal server error");
		}
	}
	async getUserByUsername(username: any): Promise<UserModel | null> {
		try {
			return await this.User.findUnique({ where: { username: username } });
		} catch (error: any) {
			throw createError(error.statusCode || 500, error.message || "Internal server error");
		}
	}
	async updateUser(id: any, username: any, email: any, hashedPassowrd: any): Promise<UserModel | null> {
		throw new Error("Method not implemented.");
	}
	async deleteUser(id: any): Promise<UserModel | null> {
		throw new Error("Method not implemented.");
	}
	async getUserByEmailOrUsername(emailOrUsername: any): Promise<UserModel | null> {
		try {
			if (!emailOrUsername) throw createError(400, "Missing required fields");
			return await this.User.findFirst({
				where: {
					OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
				},
			});
		} catch (error: any) {
			throw createError(error.statusCode || 500, error.message || "Internal server error");
		}
	}
}
export default UserServicePrisma;
