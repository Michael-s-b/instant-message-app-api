import { Router } from "express";
import { chatController } from "../controllers";
import { isAuthenticatedMiddleware } from "../middlewares";
const chatRouter = Router();
chatRouter.get("/chats", isAuthenticatedMiddleware, chatController.getAllChats); // GET /chats;
chatRouter.post("/chats/direct", isAuthenticatedMiddleware, chatController.createDirectChat); // POST /chats/direct;
chatRouter.post("/chats/group", isAuthenticatedMiddleware, chatController.createGroupChat); // POST /chats/group;
chatRouter.get("/chats/:id", isAuthenticatedMiddleware, chatController.getChatById); // GET /chats/:id;
chatRouter.put("/chats/:id", isAuthenticatedMiddleware, chatController.updateChat); // PUT /chats/:id;
chatRouter.delete("/chats/:id", isAuthenticatedMiddleware, chatController.deleteChat); // DELETE /chats/:id;

export default chatRouter;
