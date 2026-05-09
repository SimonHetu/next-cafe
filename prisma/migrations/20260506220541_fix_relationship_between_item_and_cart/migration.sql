/*
  Warnings:

  - You are about to drop the column `shippingCity` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shippingCost` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shippingCountry` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shippingFirstName` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shippingLastName` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shippingLine1` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shippingLine2` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shippingPhone` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shippingPostalCode` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shippingStateProvince` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `subtotal` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `Order` table. All the data in the column will be lost.
  - The primary key for the `ProductFlavorNote` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `productSlug` on the `ProductFlavorNote` table. All the data in the column will be lost.
  - You are about to drop the `Address` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `productId` to the `ProductFlavorNote` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_userId_fkey";

-- DropForeignKey
ALTER TABLE "ProductFlavorNote" DROP CONSTRAINT "ProductFlavorNote_productSlug_fkey";

-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "cartId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "shippingCity",
DROP COLUMN "shippingCost",
DROP COLUMN "shippingCountry",
DROP COLUMN "shippingFirstName",
DROP COLUMN "shippingLastName",
DROP COLUMN "shippingLine1",
DROP COLUMN "shippingLine2",
DROP COLUMN "shippingPhone",
DROP COLUMN "shippingPostalCode",
DROP COLUMN "shippingStateProvince",
DROP COLUMN "subtotal",
DROP COLUMN "total";

-- AlterTable
ALTER TABLE "ProductFlavorNote" DROP CONSTRAINT "ProductFlavorNote_pkey",
DROP COLUMN "productSlug",
ADD COLUMN     "productId" TEXT NOT NULL,
ADD CONSTRAINT "ProductFlavorNote_pkey" PRIMARY KEY ("productId", "flavorNoteId");

-- DropTable
DROP TABLE "Address";

-- AddForeignKey
ALTER TABLE "ProductFlavorNote" ADD CONSTRAINT "ProductFlavorNote_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
