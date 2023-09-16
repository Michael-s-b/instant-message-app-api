import { Request, Response } from "express";
import { ProfileServicePrisma } from "../services";
import { ProfileService } from "../services/interfaces";
class ProfileController {
	//GET api/profiles
	public async getProfiles(req: Request, res: Response) {
		const userId = req.userId;
		let profileService: ProfileService;
		try {
			profileService = new ProfileServicePrisma();
			const profile = await profileService.getProfiles();
			res.status(200).json(profile);
		} catch (error: any) {
			return res.status(error.statusCode || 500).json({ error: error.message });
		}
	}
	//GET api/profiles/:id
	public async getProfile(req: Request, res: Response) {}
	//PUT api/profiles/:id
	public async editProfile(req: Request, res: Response) {}
}
export default ProfileController;
