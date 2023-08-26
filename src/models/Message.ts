import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const Message = prisma.message;
export default Message;
