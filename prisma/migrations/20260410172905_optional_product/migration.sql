/*
Warnings:

- Made the column `productId` on table `Item` required. This step will fail if there are existing NULL values in that column.

 */
-- DropForeignKey
ALTER TABLE "Item"
DROP CONSTRAINT "Item_productId_fkey";

-- AlterTable
ALTER TABLE "Item"
ALTER COLUMN "productId"
SET
  NOT NULL;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Product" ADD CONSTRAINT "stock_non_negative" CHECK ("stockQuantity" >= 0);