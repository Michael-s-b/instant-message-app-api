import { Router } from "express";
import authController from "../controllers/authController";
const authRoute = Router();
authRoute.post("/signup", authController.signUp);
authRoute.post("/signin", authController.signIn);
authRoute.post("/logout", authController.logOut);

export default authRoute;
