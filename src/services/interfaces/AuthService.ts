import { UserModel } from "../../models";
export type AuthMethod = "jwt" | "google";
export type SignUpParams<T extends AuthMethod> = T extends "jwt"
	? { email: string; username: string; password: string }
	: T extends "google"
	? { googleCode: string }
	: never;

export type SignInParams<T extends AuthMethod> = T extends "jwt"
	? { emailOrUsername: string; password: string }
	: T extends "google"
	? { googleCode: string }
	: never;
interface AuthService {
	signIn(params: SignInParams<AuthMethod>): Promise<string>;
	signUp(params: SignUpParams<AuthMethod>): Promise<UserModel>;
}
export default AuthService;
