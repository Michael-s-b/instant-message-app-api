import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const Chat = prisma.chat;
export default Chat;
