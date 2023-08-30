import { Router } from "express";
import { AuthController } from "../controllers";
const authRoute = Router();
authRoute.post("/signup", new AuthController().signUp);
authRoute.post("/signin", new AuthController().signIn);
//authRoute.post("/logout", new authController(new AuthServiceJWT()).logOut);

export default authRoute;
