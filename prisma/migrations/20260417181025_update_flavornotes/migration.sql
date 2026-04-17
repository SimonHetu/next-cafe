-- DropForeignKey
ALTER TABLE "ProductFlavorNote" DROP CONSTRAINT "ProductFlavorNote_productId_fkey";

-- AddForeignKey
ALTER TABLE "ProductFlavorNote" ADD CONSTRAINT "ProductFlavorNote_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;
