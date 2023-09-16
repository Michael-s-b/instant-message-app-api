import express from "express";
import { authTokenMiddleware } from "../middlewares";
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
// global middlewares
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(authTokenMiddleware); // for decoding jwt token and authenticating user

export default app;
