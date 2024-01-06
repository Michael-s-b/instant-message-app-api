import { ProfileModel } from "../../models";
import { z } from "zod";

const GetProfilesParamsSchema = z.object({
	username: z.string().optional(),
	offset: z.number().optional(),
	limit: z.number().optional(),
});

type GetProfilesParams = z.infer<typeof GetProfilesParamsSchema>;

interface ProfileService {
	getProfileById(id: number): Promise<ProfileModel | null>;
	getProfiles(params: GetProfilesParams): Promise<ProfileModel[]>;
	updateProfile(username: any, update: { bio: any; name: any }): Promise<ProfileModel | null>;
}
export default ProfileService;
