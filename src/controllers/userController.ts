import { Request, Response } from "express";
import { UserService } from "../services/interfaces";
import { UserServicePrisma } from "../services";

class UserController {
	public async getAllUsers(req: Request, res: Response) {
		let userService: UserService;
		try {
			userService = new UserServicePrisma();
			const allUsers = await userService.getAllUsers();
			res.json({ data: allUsers }).status(200);
		} catch (error: any) {
			return res.status(error.statusCode || 500).json({ error: error.message });
		}
	}
	public async getUserById(req: Request, res: Response) {
		res.send("GET /users/:id");
	}
	public async updateUser(req: Request, res: Response) {
		res.send("PUT /users/:id");
	}
	public async deleteUser(req: Request, res: Response) {
		res.send("DELETE /users/:id");
	}
}
export default UserController;
