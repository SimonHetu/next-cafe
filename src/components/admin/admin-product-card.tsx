"use client";

import { useState } from "react";
import { RoastLevel } from "../../generated/prisma/enums";
import { RoastBadge } from "../ui/roast-badge";
import Link from "next/link";
import Image from "next/image";
import { Edit2, Package, Trash2 } from "lucide-react";
import {
  deleteProductAction,
  updateProductStockAction,
  toggleProductActiveAction,
} from "@/src/lib/products/product.actions";

interface ProductCardProps {
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

export function AdminProductCard({
  id,
  name,
  slug,
  description,
  imageUrl,
  price,
  roastLevel,
  stockQuantity,
  isActive,
  origin,
}: ProductCardProps) {
  const [showStockModal, setShowStockModal] = useState(false);
  const [newStock, setNewStock] = useState(stockQuantity);
  const [isLoading, setIsLoading] = useState(false);

  async function handleStockUpdate() {
    setIsLoading(true);
    const result = await updateProductStockAction(id, newStock);
    setIsLoading(false);

    if (result.success) {
      setShowStockModal(false);
    } else {
      alert(result.error || "Failed to update stock");
    }
  }

  async function handleToggleStatus() {
    setIsLoading(true);
    const result = await toggleProductActiveAction(id);
    setIsLoading(false);

    if (!result.success) {
      alert(result.error || "Failed to toggle status");
    }
  }

  async function handleDeleteProduct() {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }
    setIsLoading(true);
    const result = await deleteProductAction(id);
    setIsLoading(false);

    if (!result.success) {
      alert(result.error || "Failed to delete product");
    }
  }

  return (
    <>
      <div className="w-full border border-base-content/10 bg-base-100 transition-all duration-500 hover:border-base-content/25 hover:shadow-lg hover:shadow-primary/5 flex items-stretch gap-4 p-4">
        {/* Image */}
        <div className="relative w-24 h-24 shrink-0 overflow-hidden">
          <Image
            fill
            src={imageUrl}
            alt={`Product ${name} image`}
            className="object-contain p-2"
          />
        </div>

        {/* Info produits */}
        <div className="flex-1 min-w-0">
          <Link href={`/products/${slug}`}>
            <h2 className="text-base font-bold truncate">{name}</h2>
            <p className="line-clamp-1 text-sm text-base-content/50">
              {description}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <RoastBadge roastLevel={roastLevel} />
              <span className="text-xs text-base-content/70">• {origin}</span>
            </div>
          </Link>

          {/* Gestion stock */}
          <div className="flex items-center gap-3 mt-2">
            <div className="text-sm">
              <span className="text-base-content/70">Stock: </span>
              <span className="font-semibold">{stockQuantity}</span>
            </div>
            <button
              onClick={() => setShowStockModal(true)}
              className="btn btn-xs btn-outline hover:btn-primary gap-1"
              title="Update stock"
            >
              <Package className="w-3 h-3" />
            </button>
            <div className="text-sm">
              <span className="text-base-content/70">Price: </span>
              <span className="font-semibold">${price.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end justify-between shrink-0">
          <div className="flex gap-1">
            {/* Bouton delete */}
            <button
              onClick={handleDeleteProduct}
              disabled={isLoading}
              className="btn btn-xs btn-outline gap-1 hover:btn-error disabled:opacity-50"
              title="Delete product"
            >
              <Trash2 className="w-3 h-3" />
            </button>

            {/* Bouton edit produit*/}
            <Link
              href={`/admin/products/${id}/edit`}
              className="btn btn-xs btn-outline gap-1 hover:btn-secondary"
              title="Edit product"
            >
              <Edit2 className="w-3 h-3" />
            </Link>
          </div>

          {/* Bouton toggle active/inactive */}
          <button
            onClick={handleToggleStatus}
            disabled={isLoading}
            className={`badge gap-1 font-semibold cursor-pointer disabled:opacity-50 bg-black text-white border ${
              isActive ? "border-green-500" : "border-red-500"
            }`}
            title={isActive ? "Click to deactivate" : "Click to activate"}
          >
            {isActive ? "ACTIVE" : "INACTIVE"}
          </button>
        </div>
      </div>

      {/* Popup update de stock */}
      {showStockModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-base-100 rounded-lg p-6 max-w-sm w-full shadow-lg">
            <h3 className="text-lg font-bold mb-4">Update Stock Quantity</h3>
            <input
              type="number"
              min="0"
              value={newStock}
              onChange={(e) => setNewStock(parseInt(e.target.value) || 0)}
              className="input input-bordered w-full mb-4"
              placeholder="Enter new stock quantity"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowStockModal(false)}
                disabled={isLoading}
                className="btn btn-ghost flex-1 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleStockUpdate}
                disabled={isLoading}
                className="btn btn-primary flex-1 disabled:opacity-50"
              >
                {isLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
