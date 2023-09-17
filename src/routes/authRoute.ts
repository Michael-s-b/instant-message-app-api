import { Router } from "express";
import { AuthController } from "../controllers";
import { isAuthenticatedMiddleware } from "../middlewares";
const authRoute = Router();
authRoute.post("/auth/signup", new AuthController().signUp);
authRoute.get("/auth/signup", new AuthController().signUp); // for testing google auth
authRoute.post("/auth/signin", new AuthController().signIn);
authRoute.get("/auth/signin", new AuthController().signIn); // for testing google auth
authRoute.get("/auth/logout", isAuthenticatedMiddleware, new AuthController().logOut);

export default authRoute;
