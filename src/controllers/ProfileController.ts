import { NextFunction, Request, Response } from "express";
import { ProfileServicePrisma } from "../services";
import { ProfileService } from "../services/interfaces";
import { HTTP_STATUS_CODE } from "../enums";
class ProfileController {
	//GET api/profiles
	public async getProfiles(req: Request, res: Response, next: NextFunction) {
		const userId = req.userId;
		let profileService: ProfileService;
		try {
			profileService = new ProfileServicePrisma();
			const profile = await profileService.getProfiles();
			res.status(HTTP_STATUS_CODE.OK).json(profile);
		} catch (error: any) {
			next(error);
		}
	}
	//GET api/profiles/:id
	public async getProfile(req: Request, res: Response) {}
	//PUT api/profiles/:id
	public async editProfile(req: Request, res: Response) {}
}
export default ProfileController;
