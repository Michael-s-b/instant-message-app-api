import { Router } from "express";
import { userController } from "../controllers";
const userRouter = Router();

userRouter.get("/users", userController.getAllUsers); // GET /users;
//userRouter.post("/users", userController.createUser); // POST /users;
userRouter.get("/users/:id", userController.getUserById); // GET /users/:id;
userRouter.put("/users/:id", userController.updateUser); // PUT /users/:id;
userRouter.delete("/users/:id", userController.deleteUser); // DELETE /users/:id;

export default userRouter;
