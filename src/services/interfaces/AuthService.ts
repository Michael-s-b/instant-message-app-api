import { UserModel } from "../../models";
import z from "zod";

export type AuthToken = {
	token: string;
	expires: number;
};
export type AuthMethod = "local" | "google";

export const SignUpParamsLocalSchema = z.object({
	email: z.string().trim().email(),
	username: z.string().trim().min(3).max(20),
	password: z.string().trim().min(6).max(20),
});
export const SignUpParamsGoogleSchema = z.object({
	googleCode: z.string().trim(),
	redirectUri: z.string().trim(),
});

export type SignUpParams<T extends AuthMethod> = T extends "local"
	? z.infer<typeof SignUpParamsLocalSchema>
	: T extends "google"
	? z.infer<typeof SignUpParamsGoogleSchema>
	: never;

export const SignInParamsLocalSchema = z.object({
	emailOrUsername: z.string().trim().min(3),
	password: z.string().trim().min(6).max(20),
});
export const SignInParamsGoogleSchema = z.object({
	googleCode: z.string({ invalid_type_error: "Invalid google code", required_error: "Missing google code" }).trim(),
	redirectUri: z
		.string({ invalid_type_error: "Invalid redirect uri", required_error: "Missing redirect uri" })
		.trim(),
});

export type SignInParams<T extends AuthMethod> = T extends "local"
	? z.infer<typeof SignInParamsLocalSchema>
	: T extends "google"
	? z.infer<typeof SignInParamsGoogleSchema>
	: never;
interface AuthService {
	signIn(params: SignInParams<AuthMethod>): Promise<AuthToken>;
	signUp(params: SignUpParams<AuthMethod>): Promise<UserModel>;
}
export default AuthService;
