import { prismaClient } from "../database";
import { ProfileModel } from "../models";
import { ProfileService } from "./interfaces";
class ProfileServicePrisma implements ProfileService {
	private Profile;
	constructor() {
		// dependency injection
		this.Profile = prismaClient.profile;
	}
	public async getProfile(username: any): Promise<ProfileModel | null> {
		if (!username) throw new Error("Missing required fields");
		return this.Profile.findUnique({ where: { username: username } });
	}
	public async getProfiles(): Promise<ProfileModel[]> {
		return this.Profile.findMany();
	}
	public async updateProfile(username: any, update: { bio: any; name: any }): Promise<ProfileModel | null> {
		if (!username) throw new Error("Missing required fields");
		return await this.Profile.update({ where: { username: username }, data: update });
	}
}
export default ProfileServicePrisma;
