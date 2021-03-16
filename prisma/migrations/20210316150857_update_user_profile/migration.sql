/*
  Warnings:

  - You are about to drop the column `authorId` on the `Product` table. All the data in the column will be lost.
  - The migration will change the primary key for the `Profile` table. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `firstName` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `phOneNo` on the `Profile` table. All the data in the column will be lost.
  - The migration will add a unique constraint covering the columns `[userId]` on the table `Profile`. If there are existing duplicate values, the migration will fail.
  - Added the required column `username` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_authorId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "authorId",
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_pkey",
DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "phOneNo",
ADD COLUMN     "username" TEXT NOT NULL,
ADD COLUMN     "phoneNo" INTEGER,
ALTER COLUMN "profileImage" DROP NOT NULL,
ALTER COLUMN "dob" DROP NOT NULL,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "country" DROP NOT NULL,
ALTER COLUMN "state" DROP NOT NULL,
ADD PRIMARY KEY ("userId", "username");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_unique" ON "Profile"("userId");

-- AddForeignKey
ALTER TABLE "Product" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
