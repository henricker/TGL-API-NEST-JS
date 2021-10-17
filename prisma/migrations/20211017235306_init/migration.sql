/*
  Warnings:

  - A unique constraint covering the columns `[rememberMeToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_rememberMeToken_key" ON "User"("rememberMeToken");
