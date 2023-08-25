import dotenv from "dotenv";
dotenv.config();
import { PrismaClient } from "@prisma/client";
import { app } from "./config";
import Routes from "./routes";
export const prismaClient = new PrismaClient();
//setup routes
app.use("/api", Routes.authRouter);
app.use("/api", Routes.userRouter);
app.use("/api", Routes.chatRouter);
//start server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
