import { prismaClient } from "../database";
import { ProfileModel } from "../models";
import { ProfileService } from "./interfaces";

import { GetProfilesQueryParams } from "./interfaces/ProfileService";
class ProfileServicePrisma implements ProfileService {
	private Profile;
	constructor() {
		// dependency injection
		this.Profile = prismaClient.profile;
	}
	public async getProfileById(id: number): Promise<ProfileModel | null> {
		if (!id) throw new Error("Missing required fields");
		return this.Profile.findUnique({ where: { id } });
	}
	public async getProfiles({ limit = 15, offset = 0, username }: GetProfilesQueryParams): Promise<ProfileModel[]> {
		return this.Profile.findMany({ where: { username: username }, take: limit, skip: offset });
	}
	public async updateProfile(username: any, update: { bio: any; name: any }): Promise<ProfileModel | null> {
		if (!username) throw new Error("Missing required fields");
		return await this.Profile.update({ where: { username: username }, data: update });
	}
}
export default ProfileServicePrisma;
