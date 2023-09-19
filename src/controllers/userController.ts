import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/interfaces";
import { UserServicePrisma } from "../services";
import { HTTP_STATUS_CODE } from "../enums";

class UserController {
	//GET api/users
	public async getAllUsers(req: Request, res: Response, next: NextFunction) {
		let userService: UserService;
		try {
			userService = new UserServicePrisma();
			const allUsers = await userService.getAllUsers();
			res.json({ data: allUsers }).status(HTTP_STATUS_CODE.OK);
		} catch (error: any) {
			next(error);
		}
	}
	//GET api/users/:id
	public async getUserById(req: Request, res: Response) {
		res.send("GET /users/:id");
	}
	//PUT api/users/:id
	public async updateUser(req: Request, res: Response) {
		res.send("PUT /users/:id");
	}
	//DELETE api/users/:id
	public async deleteUser(req: Request, res: Response) {
		res.send("DELETE /users/:id");
	}
}
export default UserController;
