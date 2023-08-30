import { Router } from "express";
import { ChatController } from "../controllers";
import { isAuthenticatedMiddleware } from "../middlewares";
const chatRouter = Router();
chatRouter.get("/chats", isAuthenticatedMiddleware, new ChatController().getAllChats); // GET /chats;
chatRouter.post("/chats/direct", isAuthenticatedMiddleware, new ChatController().createDirectChat); // POST /chats/direct;
chatRouter.post("/chats/group", isAuthenticatedMiddleware, new ChatController().createGroupChat); // POST /chats/group;
chatRouter.delete("/chats/:id", isAuthenticatedMiddleware, new ChatController().deleteChat); // DELETE /chats/:id;

export default chatRouter;
