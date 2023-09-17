import { UserModel } from "../../models";
import { AuthMethod } from "./AuthService";

export type CreateUserParams<T extends AuthMethod> = T extends "local"
	? {
			username: string;
			email: string;
			hashedPassword: string;
			authMethod: T;
	  }
	: T extends "google"
	? {
			username: string;
			email: string;
			googleId: string;
			authMethod: T;
	  }
	: never;

interface UserService {
	getAllUsers(): Promise<UserModel[]>;
	//User can be created with different auth methods (local, google, etc.) the implementation of the service should handle all the cases
	createUser<T extends AuthMethod>(params: CreateUserParams<T>): Promise<UserModel>;
	getUserById(id: any): Promise<UserModel | null>;
	getUserByEmail(email: any): Promise<UserModel | null>;
	getUserByUsername(username: any): Promise<UserModel | null>;
	updateUser(id: any, username: any, email: any, hashedPassowrd: any): Promise<UserModel | null>;
	deleteUser(id: any): Promise<UserModel | null>;
	getUserByEmailOrUsername(emailOrUsername: any): Promise<UserModel | null>;
}
export default UserService;
