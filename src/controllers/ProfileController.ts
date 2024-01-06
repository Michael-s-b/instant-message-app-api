import { NextFunction, Request, Response } from "express";
import { ProfileServicePrisma } from "../services";
import { ProfileService } from "../services/interfaces";
import { HTTP_STATUS_CODE } from "../enums";
import { SuccessResponse } from "../types/SuccessResponse";
class ProfileController {
	//GET api/profiles
	public async getProfiles(req: Request, res: Response, next: NextFunction) {
		const { username, offset, limit } = req.query;
		let profileService: ProfileService;
		try {
			profileService = new ProfileServicePrisma();
			const profile = await profileService.getProfiles({
				username: username as string | undefined,
				offset: offset ? parseInt(offset as string) : undefined,
				limit: limit ? parseInt(limit as string) : undefined,
			});
			const responseBody: SuccessResponse<typeof profile> = {
				status: "success",
				message: "Successfully fetched profiles",
				data: profile,
			};
			res.status(HTTP_STATUS_CODE.OK).json(responseBody);
		} catch (error: any) {
			next(error);
		}
	}
	//GET api/profiles/:id
	public async getProfileById(req: Request, res: Response, next: NextFunction) {
		const { id } = req.params;
		let profileService: ProfileService;
		try {
			profileService = new ProfileServicePrisma();
			const profile = await profileService.getProfileById(parseInt(id));
			const responseBody: SuccessResponse<typeof profile> = {
				status: "success",
				message: "Successfully fetched profile",
				data: profile,
			};
			res.status(HTTP_STATUS_CODE.OK).json(responseBody);
		} catch (error: any) {
			next(error);
		}
	}
	//PUT api/profiles/:id
	public async editProfile(req: Request, res: Response) {}
}
export default ProfileController;
