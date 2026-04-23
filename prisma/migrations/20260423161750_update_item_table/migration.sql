/*
  Warnings:

  - A unique constraint covering the columns `[cartId,productId]` on the table `Item` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Item_orderId_productId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Item_cartId_productId_key" ON "Item"("cartId", "productId");
