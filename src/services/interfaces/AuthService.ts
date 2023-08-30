import { UserModel } from "../../models";

interface AuthService {
	signIn(username: string | undefined, password: string | undefined): Promise<string>;
	signUp(username: string | undefined, email: string | undefined, password: string | undefined): Promise<UserModel>;
}
export default AuthService;
