import dotenv from "dotenv";
dotenv.config();
import { app } from "./config";
//setup routes

//start server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
