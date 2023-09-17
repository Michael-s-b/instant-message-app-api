import { Router } from "express";
import { ProfileController } from "../controllers";
import { isAuthenticatedMiddleware } from "../middlewares";
const profileRouter = Router();

profileRouter.get("/profiles", isAuthenticatedMiddleware, new ProfileController().getProfiles);
profileRouter.get("/profiles/:id", isAuthenticatedMiddleware, new ProfileController().getProfile);
profileRouter.put("/profiles/:id", isAuthenticatedMiddleware, new ProfileController().editProfile);

export default profileRouter;
