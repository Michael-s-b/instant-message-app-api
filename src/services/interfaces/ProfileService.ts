import { ProfileModel } from "../../models";

interface ProfileService {
	getProfile(username: any): Promise<ProfileModel | null>;
	getProfiles(): Promise<ProfileModel[]>;
	updateProfile(username: any, update: { bio: any; name: any }): Promise<ProfileModel | null>;
}
export default ProfileService;
