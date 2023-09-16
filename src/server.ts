import dotenv from "dotenv";
dotenv.config();
import { app } from "./config";
import Routes from "./routes";
//setup routes
app.use("/api", Routes.authRouter);
app.use("/api", Routes.userRouter);
app.use("/api", Routes.chatRouter);
app.use("/api", Routes.messageRouter);
app.use("/api", Routes.profileRouter);
//start server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
	console.log("NODE_ENV: " + process.env.NODE_ENV);
	console.log("DATABASE_URI: " + process.env.DATABASE_URI);
	console.log("RUNNING_ON: " + process.env.RUNNING_ON);
});
