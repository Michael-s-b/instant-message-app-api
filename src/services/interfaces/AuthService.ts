import { UserModel } from "../../models";
export type AuthToken = {
	token: string;
	expires: number;
};
export type AuthMethod = "local" | "google";
export type SignUpParams<T extends AuthMethod> = T extends "local"
	? { email: string; username: string; password: string }
	: T extends "google"
	? {
			googleCode: string;
			redirectUri: string;
	  }
	: never;

export type SignInParams<T extends AuthMethod> = T extends "local"
	? { emailOrUsername: string; password: string }
	: T extends "google"
	? {
			googleCode: string;
			redirectUri: string;
	  }
	: never;
interface AuthService {
	signIn(params: SignInParams<AuthMethod>): Promise<AuthToken>;
	signUp(params: SignUpParams<AuthMethod>): Promise<UserModel>;
}
export default AuthService;
