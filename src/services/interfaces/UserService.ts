import { UserModel } from "../../models";
import z from "zod";
export const CreateUserWithLocalParamsSchema = z.object({
	username: z.string().trim().min(3),
	email: z.string().trim().email(),
	hashedPassword: z.string(),
});

export type CreateUserWithLocalParams = z.infer<typeof CreateUserWithLocalParamsSchema>;
const CreateUserWithGoogleParamsSchema = z.object({
	username: z.string().trim().min(3),
	email: z.string().trim().email(),
	googleId: z.string(),
});
export type CreateUserWithGoogleParams = z.infer<typeof CreateUserWithGoogleParamsSchema>;

const GetUserByIdParamsSchema = z.object({
	id: z.number(),
});
export type GetUserByIdParams = z.infer<typeof GetUserByIdParamsSchema>;

const GetUserByUsernameOrEmailParamsSchema = z.object({
	usernameOrEmail: z.string().trim().min(3),
});
export type GetUserByUsernameOrEmailParams = z.infer<typeof GetUserByUsernameOrEmailParamsSchema>;

const UpdateUserParamsSchema = z.object({
	id: z.number(),
	username: z.string().trim().min(3),
	email: z.string().trim().email(),
	hashedPassword: z.string(),
});
export type UpdateUserParams = z.infer<typeof UpdateUserParamsSchema>;

const DeleteUserParamsSchema = z.object({
	id: z.number(),
});
export type DeleteUserParams = z.infer<typeof DeleteUserParamsSchema>;

const GetUserByEmailParamsSchema = z.object({
	email: z.string().trim().email(),
});
export type GetUserByEmailParams = z.infer<typeof GetUserByEmailParamsSchema>;

const GetUserByUsernameParamsSchema = z.object({
	username: z.string().trim().min(3),
});
export type GetUserByUsernameParams = z.infer<typeof GetUserByUsernameParamsSchema>;
interface UserService {
	getAllUsers(): Promise<UserModel[]>;
	createUserWithLocal(params: CreateUserWithLocalParams): Promise<UserModel>;
	createUserWithGoogle(params: CreateUserWithGoogleParams): Promise<UserModel>;
	getUserById(params: GetUserByIdParams): Promise<UserModel | null>;
	getUserByEmail(params: GetUserByEmailParams): Promise<UserModel | null>;
	getUserByUsername(params: GetUserByUsernameParams): Promise<UserModel | null>;
	updateUser(params: UpdateUserParams): Promise<UserModel | null>;
	deleteUser(params: DeleteUserParams): Promise<UserModel | null>;
	getUserByEmailOrUsername(params: GetUserByUsernameOrEmailParams): Promise<UserModel | null>;
}
export default UserService;
