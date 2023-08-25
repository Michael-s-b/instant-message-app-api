/*
  Warnings:

  - A unique constraint covering the columns `[userId,chatId]` on the table `User_Chat` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `User_Chat_userId_chatId_key` ON `User_Chat`(`userId`, `chatId`);
