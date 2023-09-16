import { Router } from "express";
import { ProfileController } from "../controllers";
const profileRouter = Router();

profileRouter.get("/profiles", new ProfileController().getProfiles);
profileRouter.get("/profiles/:id", new ProfileController().getProfile);
profileRouter.put("/profiles/:id", new ProfileController().editProfile);

export default profileRouter;
