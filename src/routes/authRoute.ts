import { Router } from "express";
import { AuthController } from "../controllers";
const authRoute = Router();
authRoute.post("/auth/signup", new AuthController().signUp);
authRoute.post("/auth/signin", new AuthController().signIn);
//authRoute.post("/logout", new authController(new AuthServiceJWT()).logOut);

export default authRoute;
