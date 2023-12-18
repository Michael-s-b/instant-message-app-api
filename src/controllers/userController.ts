import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/interfaces";
import { UserServicePrisma } from "../services";
import { HTTP_STATUS_CODE } from "../enums";

class UserController {
	//GET api/users
	public async getAllUsers(req: Request, res: Response, Next: NextFunction) {
		let userService: UserService;
		try {
			userService = new UserServicePrisma();
			const allUsers = await userService.getAllUsers();
			res.json(allUsers).status(HTTP_STATUS_CODE.OK);
		} catch (error: any) {
			Next(error);
		}
	}
	//GET api/users/:id
	public async getUserById(req: Request, res: Response, Next: NextFunction) {
		let userService: UserService;
		const id = req.params.id;

		try {
			userService = new UserServicePrisma();
			const user = await userService.getUserById({ id: parseInt(id) });
			res.json(user).status(user ? HTTP_STATUS_CODE.OK : HTTP_STATUS_CODE.NOT_FOUND);
		} catch (error: any) {
			Next(error);
		}
	}
	//PUT api/users/:id
	public async updateUser(req: Request, res: Response) {
		res.send("PUT /users/:id");
	}
	//DELETE api/users/:id
	public async deleteUser(req: Request, res: Response) {
		res.send("DELETE /users/:id");
	}
	//GET api/user
	public async getMe(req: Request, res: Response, Next: NextFunction) {
		let userService: UserService;
		const id = req.userId;

		try {
			userService = new UserServicePrisma();
			const user = await userService.getUserById({ id: id! });
			res.json(user).status(user ? HTTP_STATUS_CODE.OK : HTTP_STATUS_CODE.NOT_FOUND);
		} catch (error: any) {
			Next(error);
		}
	}
}
export default UserController;
