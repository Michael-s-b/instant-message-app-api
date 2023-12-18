import { Router } from "express";
import { UserController } from "../controllers";
import { isAuthenticatedMiddleware } from "../middlewares";
const userRouter = Router();

userRouter.get("/users", isAuthenticatedMiddleware, new UserController().getAllUsers); // GET /users;
//userRouter.post("/users", new UserController().createUser); // POST /users;
userRouter.get("/users/:id", isAuthenticatedMiddleware, new UserController().getUserById); // GET /users/:id;
userRouter.put("/users/:id", isAuthenticatedMiddleware, new UserController().updateUser); // PUT /users/:id;
userRouter.delete("/users/:id", isAuthenticatedMiddleware, new UserController().deleteUser); // DELETE /users/:id;
userRouter.get("/user", isAuthenticatedMiddleware, new UserController().getMe); // GET /user;

export default userRouter;
