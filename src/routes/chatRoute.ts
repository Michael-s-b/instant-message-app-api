import { Router } from "express";
import { chatController } from "../controllers";
const chatRouter = Router();
chatRouter.get("/chats", chatController.getAllChats); // GET /chats;
chatRouter.post("/chats", chatController.createChat); // POST /chats;
chatRouter.get("/chats/:id", chatController.getChatById); // GET /chats/:id;
chatRouter.put("/chats/:id", chatController.updateChat); // PUT /chats/:id;
chatRouter.delete("/chats/:id", chatController.deleteChat); // DELETE /chats/:id;

export default chatRouter;
