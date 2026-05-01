"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { AdminProductCard } from "@/src/components/admin/admin-product-card";
import { RoastLevel } from "@/src/generated/prisma/enums";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  detailDescription: string;
  imageUrl: string;
  price: number;
  roastLevel: RoastLevel;
  stockQuantity: number;
  isActive: boolean;
  origin: string | null;
}

interface AdminProductsSectionProps {
  products: Product[];
}

export function AdminProductsSection({ products }: AdminProductsSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filtrer les produits par nom avec la barre de recherche
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="border border-base-content/10 rounded-lg overflow-y-auto max-h-[600px] relative">
      <div className="sticky top-0 z-40 bg-base-100 border-b border-base-content/10 p-4 flex gap-3 items-center justify-between">
        <div className="flex-1 flex items-center gap-2 bg-base-200 rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-base-content/50" />
          <input
            type="text"
            placeholder="Search product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent outline-none flex-1 text-sm"
          />
        </div>
        <Link href="/admin/products/new" className="btn btn-primary btn-sm gap-2">
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      <div className="space-y-2 p-4">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-base-content/70 text-sm">
              {searchQuery
                ? "No products found matching your search."
                : "No products available."}
            </p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <AdminProductCard
              key={product.id}
              id={product.id}
              slug={product.slug}
              name={product.name}
              description={product.description}
              detailDescription={product.detailDescription}
              imageUrl={product.imageUrl}
              price={product.price}
              roastLevel={product.roastLevel}
              stockQuantity={product.stockQuantity}
              isActive={product.isActive}
              origin={product.origin}
            />
          ))
        )}
      </div>
    </div>
  );
}
