import { Router } from "express";
import { MessageController } from "../controllers";
import { isAuthenticatedMiddleware } from "../middlewares";
const messageRouter = Router();
messageRouter.get("/messages", isAuthenticatedMiddleware, new MessageController().getMessages); // GET /messages;
messageRouter.post("/messages", isAuthenticatedMiddleware, new MessageController().createMessage); // POST /messages;
messageRouter.put("/messages/:id", isAuthenticatedMiddleware, new MessageController().editMessage); // PUT /messages/:id;
messageRouter.delete("/messages/:id", isAuthenticatedMiddleware, new MessageController().deleteMessage); // DELETE /messages/:id;
export default messageRouter;
