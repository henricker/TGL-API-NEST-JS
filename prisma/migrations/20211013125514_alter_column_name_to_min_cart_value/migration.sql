/*
  Warnings:

  - You are about to drop the column `min_cart_value` on the `Game` table. All the data in the column will be lost.
  - Added the required column `minCartValue` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "min_cart_value",
ADD COLUMN     "minCartValue" INTEGER NOT NULL;
