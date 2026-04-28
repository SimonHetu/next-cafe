"use client";

import { useState } from "react";
import { RoastLevel } from "../../generated/prisma/enums";
import { RoastBadge } from "./roast-badge";
import { LucideShoppingCart, Check } from "lucide-react";
import Link from "next/link";
import { PriceTag } from "./price-tag";
import { addToCartAction } from "@/src/lib/cart/cart.actions";
import { addToGuestCart } from "@/src/lib/cart/guest-cart";
import { ActionForm } from "@/src/components/ui/action-form";
import Image from "next/image";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  price: number;
  roastLevel: RoastLevel;
  stockQuantity: number;
  origin: string | null;
  userId?: string;
}

export function ProductCard({
  id,
  name,
  slug,
  description,
  imageUrl,
  price,
  roastLevel,
  userId,
}: ProductCardProps) {
  const [added, setAdded] = useState(false);

  const handleGuestAdd = () => {
    addToGuestCart({
      productId: id,
      productName: name,
      quantity: 1,
      unitPrice: price,
      imageUrl,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="w-full max-w-85 border border-base-content/10 bg-base-100 transition-all duration-500 hover:border-base-content/25 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1">
      <Link href={`/products/${slug}`} className="block group">
        <div className="relative aspect-4/3 w-full p-6 overflow-hidden">
          <Image
            fill
            src={imageUrl}
            alt={`Product ${name} image`}
            className="object-contain p-2 transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="p-5">
        <Link href={`/products/${slug}`}>
          <h2 className="text-lg font-bold">{name}</h2>
          <p className="line-clamp-2 text-sm text-base-content/50 mt-1">
            {description}
          </p>
          <div className="mt-3">
            <RoastBadge roastLevel={roastLevel} />
          </div>
        </Link>
        <div className="flex justify-between items-end mt-5">
          <PriceTag price={price} />
          {userId ? (
            <ActionForm action={addToCartAction}>
              <input type="hidden" name="userId" value={userId} />
              <input type="hidden" name="productId" value={id} />
              <input type="hidden" name="quantity" value="1" />
              <button
                type="submit"
                className="bg-base-content/10 hover:bg-base-content/20 p-2.5 transition-colors cursor-pointer"
                disabled={added}
              >
                {added ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <LucideShoppingCart className="w-4 h-4" />
                )}
              </button>
            </ActionForm>
          ) : (
            <button
              onClick={handleGuestAdd}
              className="bg-base-content/10 hover:bg-base-content/20 p-2.5 transition-colors cursor-pointer"
              disabled={added}
            >
              {added ? (
                <Check className="w-4 h-4" />
              ) : (
                <LucideShoppingCart className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
