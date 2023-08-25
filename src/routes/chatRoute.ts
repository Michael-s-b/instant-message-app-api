import { Router } from "express";
import { chatController } from "../controllers";
const chatRouter = Router();
chatRouter.get("/chats", chatController.getAllChats); // GET /chats;
chatRouter.post("/chats/direct", chatController.createDirectChat); // POST /chats/direct;
chatRouter.post("/chats/group", chatController.createGroupChat); // POST /chats/group;
chatRouter.get("/chats/:id", chatController.getChatById); // GET /chats/:id;
chatRouter.put("/chats/:id", chatController.updateChat); // PUT /chats/:id;
chatRouter.delete("/chats/:id", chatController.deleteChat); // DELETE /chats/:id;

export default chatRouter;
