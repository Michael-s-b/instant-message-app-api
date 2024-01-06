import express from "express";
import cookieParser from "cookie-parser";
import { authTokenMiddleware, exceptionHandlerMiddleware } from "../middlewares";
import Routes from "../routes";
import cors from "cors";
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
// Configure CORS to allow requests from your frontend origin (localhost:5173)
const corsOptions = {
	origin: "http://localhost:5173",
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	credentials: true, // This allows cookies and authorization headers to be sent
};
const app = express();
//global middlewares
app.use(cors(corsOptions));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser()); // for parsing cookies
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
