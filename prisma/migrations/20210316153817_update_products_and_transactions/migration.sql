/*
  Warnings:

  - Added the required column `baseCost` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionId` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "baseCost" INTEGER NOT NULL,
ADD COLUMN     "currency" TEXT NOT NULL,
ADD COLUMN     "refundable" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Token" ADD COLUMN     "transactionId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paidAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "skuId" TEXT NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "amount" INTEGER NOT NULL,
    "gst" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GST" (
    "pc" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "Variant" (
    "id" TEXT NOT NULL,
    "my" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Color" (
    "id" TEXT NOT NULL,
    "hex" TEXT NOT NULL,
    "name" TEXT,
    "variantId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SKU" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "soldOut" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "retailPrice" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "gstName" TEXT NOT NULL,
    "colorId" TEXT,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Transaction" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD FOREIGN KEY ("skuId") REFERENCES "SKU"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Color" ADD FOREIGN KEY ("variantId") REFERENCES "Variant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SKU" ADD FOREIGN KEY ("gstName") REFERENCES "GST"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SKU" ADD FOREIGN KEY ("colorId") REFERENCES "Color"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
