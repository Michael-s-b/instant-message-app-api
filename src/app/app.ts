import express from "express";
import { authTokenMiddleware, exceptionHandlerMiddleware } from "../middlewares";
import Routes from "../routes";
//check for env variables
if (!process.env.JWT_SECRET) {
	console.log("FATAL ERROR: JWT_SECRET is not defined.");
	process.exit(1);
}
if (!process.env.DATABASE_URI) {
	console.log("FATAL ERROR: DATABASE_URI is not defined.");
	process.exit(1);
}
if (!process.env.PORT) {
	console.log("PORT is not defined. Defaulting to 3000");
	process.env.PORT = "3000";
}
if (!process.env.NODE_ENV) {
	console.log("NODE_ENV is not defined. Defaulting to development");
	process.env.NODE_ENV = "development";
}
const app = express();
//global middlewares
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(authTokenMiddleware); // for decoding jwt token and authenticating user
//routes
app.use("/api", Routes.authRouter);
app.use("/api", Routes.userRouter);
app.use("/api", Routes.chatRouter);
app.use("/api", Routes.messageRouter);
app.use("/api", Routes.profileRouter);
//exception handler
app.use(exceptionHandlerMiddleware);
export default app;
