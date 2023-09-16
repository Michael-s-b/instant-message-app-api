import { UserModel } from "../../models";

interface UserService {
	getAllUsers(): Promise<UserModel[]>;
	createUser(username: any, email: any, hashedPassowrd?: any): Promise<UserModel>;
	getUserById(id: any): Promise<UserModel | null>;
	getUserByEmail(email: any): Promise<UserModel | null>;
	getUserByUsername(username: any): Promise<UserModel | null>;
	updateUser(id: any, username: any, email: any, hashedPassowrd: any): Promise<UserModel | null>;
	deleteUser(id: any): Promise<UserModel | null>;
	getUserByEmailOrUsername(emailOrUsername: any): Promise<UserModel | null>;
}
export default UserService;