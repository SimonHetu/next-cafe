/*
  Warnings:

  - The primary key for the `ProductFlavorNote` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `productId` on the `ProductFlavorNote` table. All the data in the column will be lost.
  - Added the required column `productSlug` to the `ProductFlavorNote` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProductFlavorNote" DROP CONSTRAINT "ProductFlavorNote_productId_fkey";

-- AlterTable
ALTER TABLE "ProductFlavorNote" DROP CONSTRAINT "ProductFlavorNote_pkey",
DROP COLUMN "productId",
ADD COLUMN     "productSlug" TEXT NOT NULL,
ADD CONSTRAINT "ProductFlavorNote_pkey" PRIMARY KEY ("productSlug", "flavorNoteId");

-- AddForeignKey
ALTER TABLE "ProductFlavorNote" ADD CONSTRAINT "ProductFlavorNote_productSlug_fkey" FOREIGN KEY ("productSlug") REFERENCES "Product"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;
