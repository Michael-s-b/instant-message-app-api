import { Router } from "express";
import messageController from "../controllers/messageController";
import { isAuthenticatedMiddleware } from "../middlewares";
const messageRouter = Router();
messageRouter.get("/messages", isAuthenticatedMiddleware, messageController.getMessages); // GET /messages;
messageRouter.post("/messages", isAuthenticatedMiddleware, messageController.createMessage); // POST /messages;
messageRouter.put("/messages/:id", isAuthenticatedMiddleware, messageController.updateMessage); // PUT /messages/:id;
messageRouter.delete("/messages/:id", isAuthenticatedMiddleware, messageController.deleteMessage); // DELETE /messages/:id;
export default messageRouter;
