/*
  Warnings:

  - Added the required column `detailDescription` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Made the column `imageUrl` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `origin` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "detailDescription" TEXT NOT NULL,
ALTER COLUMN "imageUrl" SET NOT NULL,
ALTER COLUMN "origin" SET NOT NULL;

-- CreateTable
CREATE TABLE "ProductImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "role" TEXT,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
