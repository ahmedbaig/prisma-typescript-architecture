/*
  Warnings:

  - You are about to drop the `ratings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ratings" DROP CONSTRAINT "ratings_productId_fkey";

-- DropTable
DROP TABLE "ratings";

-- CreateTable
CREATE TABLE "Rating" (
    "id" TEXT NOT NULL,
    "stars" SMALLINT NOT NULL,
    "message" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Rating" ADD FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
