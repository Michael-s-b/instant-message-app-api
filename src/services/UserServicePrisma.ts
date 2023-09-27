import { UserService } from "./interfaces";
import { UserModel } from "../models";
import createError from "http-errors";
import { prismaClient } from "../database";
import {
	CreateUserWithGoogleParams,
	CreateUserWithLocalParams,
	DeleteUserParams,
	GetUserByEmailParams,
	GetUserByIdParams,
	GetUserByUsernameOrEmailParams,
	GetUserByUsernameParams,
	UpdateUserParams,
} from "./interfaces/UserService";

class UserServicePrisma implements UserService {
	private User;
	constructor() {
		// dependency injection
		this.User = prismaClient.user;
	}
	async createUserWithGoogle(params: CreateUserWithGoogleParams): Promise<UserModel> {
		const { googleId, email, username } = params;
		try {
			return await this.User.create({
				data: { username, email, googleId, Profile: { create: {} } },
				include: { Profile: true },
			});
		} catch (error: any) {
			throw createError(error.statusCode || 500, error.message || "Internal server error");
		}
	}
	async createUserWithLocal(params: CreateUserWithLocalParams): Promise<UserModel> {
		const { username, email, hashedPassword } = params;
		try {
			return await this.User.create({
				data: { username, email, passwordHash: hashedPassword, Profile: { create: {} } },
				include: { Profile: true },
			});
		} catch (error: any) {
			throw createError(error.statusCode || 500, error.message || "Internal server error");
		}
	}
	async getAllUsers(): Promise<UserModel[]> {
		try {
			return await this.User.findMany();
		} catch (error: any) {
			throw createError(error.statusCode || 500, error.message || "Internal server error");
		}
	}
	async getUserById(params: GetUserByIdParams): Promise<UserModel | null> {
		try {
			return await this.User.findUnique({ where: { id: params.id } });
		} catch (error: any) {
			throw createError(error.statusCode || 500, error.message || "Internal server error");
		}
	}
	async getUserByEmail(params: GetUserByEmailParams): Promise<UserModel | null> {
		try {
			return await this.User.findUnique({ where: { email: params.email } });
		} catch (error: any) {
			throw createError(error.statusCode || 500, error.message || "Internal server error");
		}
	}
	async getUserByUsername(params: GetUserByUsernameParams): Promise<UserModel | null> {
		try {
			return await this.User.findUnique({ where: { username: params.username } });
		} catch (error: any) {
			throw createError(error.statusCode || 500, error.message || "Internal server error");
		}
	}
	async updateUser(params: UpdateUserParams): Promise<UserModel | null> {
		throw new Error("Method not implemented.");
	}
	async deleteUser(params: DeleteUserParams): Promise<UserModel | null> {
		throw new Error("Method not implemented.");
	}
	async getUserByEmailOrUsername(params: GetUserByUsernameOrEmailParams): Promise<UserModel | null> {
		try {
			return await this.User.findFirst({
				where: {
					OR: [{ email: params.usernameOrEmail }, { username: params.usernameOrEmail }],
				},
			});
		} catch (error: any) {
			throw createError(error.statusCode || 500, error.message || "Internal server error");
		}
	}
}
export default UserServicePrisma;
