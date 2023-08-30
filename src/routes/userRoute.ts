import { Router } from "express";
import { UserController } from "../controllers";
const userRouter = Router();

userRouter.get("/users", new UserController().getAllUsers); // GET /users;
//userRouter.post("/users", new UserController().createUser); // POST /users;
userRouter.get("/users/:id", new UserController().getUserById); // GET /users/:id;
userRouter.put("/users/:id", new UserController().updateUser); // PUT /users/:id;
userRouter.delete("/users/:id", new UserController().deleteUser); // DELETE /users/:id;

export default userRouter;
